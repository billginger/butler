import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const createAccount = async (createUser, event) => {
  const { requestId, timeEpoch } = event.requestContext;
  const item = JSON.parse(event.body);
  item.id = requestId;
  item.amount = 0;
  item.sort = 0;
  item.isHid = 0;
  item.createUser = createUser;
  item.createDate = getMilliseconds(timeEpoch);
  const params = {
    TableName: 'account',
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
  return { id: requestId };
};

const readAccounts = async (createUser) => {
  const params = {
    TableName: 'account',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u',
    ExpressionAttributeValues: {
      ':u': createUser,
    },
    ProjectionExpression: 'id, label, currency, amount, sort, isHid',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  const accounts = data.Items;
  return accounts;
};

const getAccount = async (id, createUser) => {
  const params = {
    TableName: 'account',
    Key: { id },
  };
  const data = await ddbDocClient.send(new GetCommand(params));
  const account = data.Item;
  if (account.createUser != createUser) throw new Error('No permission!');
  return account;
};

const getHistory = (oldItem, newItem, event) => {
  const history = oldItem.history || [];
  const createDate = getMilliseconds(event.requestContext.timeEpoch);
  const data = { createDate };
  if (oldItem.label != newItem.label) {
    data.label = oldItem.label;
  }
  if (oldItem.currency != newItem.currency) {
    data.currency = oldItem.currency;
  }
  if (oldItem.isHid != newItem.isHid) {
    data.isHid = oldItem.isHid;
  }
  if (Object.keys(data).length > 1) {
    history.push(data);
  }
  return history;
};

const updateAccount = async (createUser, event) => {
  const { id } = event.pathParameters;
  const account = await getAccount(id, createUser);
  const item = JSON.parse(event.body);
  const history = getHistory(account, item, event);
  const params = {
    TableName: 'account',
    Key: { id },
    UpdateExpression: 'set label = :l, currency = :c, isHid = :i, history = :h',
    ExpressionAttributeValues: {
      ':l': item.label,
      ':c': item.currency,
      ':i': item.isHid,
      ':h': history,
    },
  };
  await ddbDocClient.send(new UpdateCommand(params));
  return { id };
};

const getData = (user, event) => {
  if (user.withUser) throw new Error('No permission!');
  switch (event.routeKey) {
    case 'PUT /accounts': return createAccount(user.openid, event);
    case 'GET /accounts': return readAccounts(user.openid);
    case 'PUT /accounts/{id}': return updateAccount(user.openid, event);
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
