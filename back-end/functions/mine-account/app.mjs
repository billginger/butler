import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser, getAccounts } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const putAccount = async (createUser, event, context) => {
  const { awsRequestId } = context;
  const item = JSON.parse(event.body);
  item.id = awsRequestId;
  item.amount = 0;
  item.sort = 0;
  item.isHid = false;
  item.createUser = createUser;
  item.createDate = getMilliseconds(event.requestContext.timeEpoch);
  const params = {
    TableName: 'account',
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
  return { id: awsRequestId };
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

const getData = (user, event, context) => {
  if (user.withUser) throw new Error('No permission!');
  switch (event.routeKey) {
    case 'PUT /accounts': return putAccount(user.openid, event, context);
    case 'GET /accounts': return getAccounts(user.openid);
    case 'PUT /accounts/{id}': return updateAccount(user.openid, event);
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
