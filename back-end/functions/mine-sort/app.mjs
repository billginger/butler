import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';

const updateSort = async (user, event) => {
  if (user.withUser) throw new Error('No permission!');
  const { table } = event.pathParameters;
  const tableList = ['account', 'category'];
  const tableIndex = tableList.findIndex(value => value == table);
  if (tableIndex == -1) throw new Error('No permission!');
  const items = JSON.parse(event.body);
  for (let index in items) {
    const params = {
      TableName: table,
      Key: {
        id: items[index],
      },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression: 'set sort = :s',
      ExpressionAttributeValues: {
        ':s': index,
      },
    };
    await ddbDocClient.send(new UpdateCommand(params));
  }
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
