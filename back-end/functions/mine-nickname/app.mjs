import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';

const updateNickname = async (openid, body) => {
  const requestBody = JSON.parse(body);
  const params = {
    TableName: 'user',
    Key: { openid },
    ConditionExpression: 'attribute_exists(openid)',
    UpdateExpression: 'set nickname = :n',
    ExpressionAttributeValues: {
      ':n': requestBody.nickname,
    },
  };
  await ddbDocClient.send(new UpdateCommand(params));
  return 'success';
};

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    const result = await updateNickname(user.openid, event.body);
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
