import { ddbDocClient } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

const getUser = async (tokenCode, expirationDate) => {
  const params = {
    TableName: 'user',
    IndexName: 'tokenIndex',
    KeyConditionExpression: 'tokenCode = :c and loginDate > :d',
    ExpressionAttributeValues: {
      ':c': tokenCode,
      ':d': expirationDate,
    },
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  const user = data.Items[0];
  return user;
};

const getTransaction = async (createUser) => {
  const params = {
    TableName: 'transaction',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u and isDeleted = :d',
    ExpressionAttributeValues: {
      ':u': createUser,
      ':d': 0,
    },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: 'direction, dateYear, dateMonth, dateDay, summary, amount, createDate',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  const transaction = data.Items[0];
  return transaction;
};

export const handler = async (event) => {
  try {
    const { token } = event.queryStringParameters;
    const timestamp = getMilliseconds(event.requestContext.requestTimeEpoch) - 864e5;
    const user = await getUser(token, timestamp);
    const transaction = await getTransaction(user.openid);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          nickname: user.nickname,
        },
        transaction,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
