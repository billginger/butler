import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const putTransaction = async (user, event, context) => {
  const { awsRequestId } = context;
  const item = JSON.parse(event.body);
  item.id = awsRequestId;
  item.ledger = user.withUser || user.openid;
  item.createUser = user.openid;
  item.createDate = getMilliseconds(event.requestContext.timeEpoch);
  item.isDeleted = 0;
  const params = {
    TableName: 'transaction',
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
  return { id: awsRequestId };
};

const getAccounts = async (user) => {
  const createUser = user.withUser || user.openid;
  const params = {
    TableName: 'account',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u',
    FilterExpression: 'isHid = :h',
    ExpressionAttributeValues: {
      ':u': createUser,
      ':h': false,
    },
    ProjectionExpression: 'id, label, currency, amount, sort',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  return data.Items;
};

const getData = (user, event, context) => {
  switch (event.routeKey) {
    case 'PUT /transactions': return putTransaction(user, event, context);
    case 'GET /transactions': return getAccounts(user);
  }
};

export const handler = async (event, context) => {
  try {
    const user = await getUser(event);
    const data = await getData(user, event, context);
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
