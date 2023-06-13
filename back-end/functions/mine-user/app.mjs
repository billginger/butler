import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';

const processUser = (user) => ({
  user: {
    nickname: user.nickname,
    withUser: !!user.withUser,
  },
});

const updateUser = async (openid, body) => {
  const item = JSON.parse(body);
  const params = {
    TableName: 'user',
    Key: { openid },
    ConditionExpression: 'attribute_exists(openid)',
    UpdateExpression: 'set nickname = :n',
    ExpressionAttributeValues: {
      ':n': item.nickname,
    },
  };
  await ddbDocClient.send(new UpdateCommand(params));
  return { result: 'success' };
};

const getData = (user, event) => {
  switch (event.routeKey) {
    case 'GET /user': return processUser(user);
    case 'PUT /user': return updateUser(user.openid, event.body);
  }
};

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    const data = await getData(user, event);
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
