import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser, getAccounts } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const getCategories = async (createUser) => {
  const params = {
    TableName: 'category',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u',
    ExpressionAttributeValues: {
      ':u': createUser,
    },
    ProjectionExpression: 'id, direction, label, sort, isHid',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  return data.Items;
};

const getOptions = async (user) => {
  const createUser = user.withUser || user.openid;
  const accounts = await getAccounts(createUser);
  const categories = await getCategories(createUser);
  return { accounts, categories };
};

const putTransaction = async (user, event, context) => {
  const { awsRequestId } = context;
  const item = JSON.parse(event.body);
  item.id = awsRequestId;
  item.ledger = user.withUser || user.openid;
  item.createUser = user.openid;
  item.createDate = getMilliseconds(event.requestContext.timeEpoch);
  item.isDeleted = false;
  const params = {
    TransactItems: [{
      Put: {
        TableName: 'transaction',
        Item: item,
      },
    }]
  };
  if (item.accountTo) {
    params.TransactItems.push({
      Update: {
        TableName: 'account',
        Key: {
          id: item.accountTo,
        },
        ConditionExpression: 'createUser = :u',
        UpdateExpression: 'add amount :a',
        ExpressionAttributeValues: {
          ':u': item.ledger,
          ':a': item.amount,
        },
      },
    });
  }
  if (item.accountFrom) {
    params.TransactItems.push({
      Update: {
        TableName: 'account',
        Key: {
          id: item.accountFrom,
        },
        ConditionExpression: 'createUser = :u',
        UpdateExpression: 'add amount :a',
        ExpressionAttributeValues: {
          ':u': item.ledger,
          ':a': -item.amount,
        },
      },
    });
  }
  await ddbDocClient.send(new TransactWriteCommand(params));
  return { id: awsRequestId };
};

const getData = (user, event, context) => {
  switch (event.routeKey) {
    case 'GET /transaction/options': return getOptions(user, event);
    case 'PUT /transactions': return putTransaction(user, event, context);
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
