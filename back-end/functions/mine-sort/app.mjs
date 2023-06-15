import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';

const updateSort = async (user, event) => {
  if (user.withUser) throw new Error('No permission!');
  const { table } = event.pathParameters;
  const tableList = ['account', 'category'];
  const tableIndex = tableList.findIndex(value => value == table);
  if (tableIndex == -1) throw new Error('No permission!');
  const items = JSON.parse(event.body);
  const TransactItems = items.map((item, index) => ({
    Update: {
      TableName: table,
      Key: {
        id: item,
      },
      ConditionExpression: 'createUser = :u',
      UpdateExpression: 'set sort = :s',
      ExpressionAttributeValues: {
        ':u': user.openid,
        ':s': index,
      },
    },
  }));
  const params = { TransactItems };
  await ddbDocClient.send(new TransactWriteCommand(params));
  return { result: 'success' };
};

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    const data = await updateSort(user, event);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }
};
