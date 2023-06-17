import { TransactWriteCommand, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser, getAccounts, getCategories } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

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

const processTransactions = async (items) => {
  const transactionsUsers = items.map(item => item.createUser);
  const Keys = [...new Set(transactionsUsers)].map(openid => ({ openid }));
  const params = {
    RequestItems: {
      user: { Keys },
    },
  };
  const data = await ddbDocClient.send(new BatchGetCommand(params));
  const users = data.Responses.user;
  const transactions = items.map(item => {
    item.createUser = users.find(element => element.openid == item.createUser).nickname;
    return item;
  });
  return transactions;
}

const queryTransactions = async (user, event) => {
  const ledger = user.withUser || user.openid;
  const item = JSON.parse(event.body);
  let FilterExpression = 'contains(summary, :s)';
  switch (item.direction) {
    case 1:
      FilterExpression += 'and attribute_not_exists(accountFrom) and attribute_exists(accountTo)';
      break;
    case 2:
      FilterExpression += 'and attribute_exists(accountFrom) and attribute_not_exists(accountTo)';
      break;
    case 3:
      FilterExpression += 'and attribute_exists(accountFrom) and attribute_exists(accountTo)';
      break;
  }
  if (item.account) {
    FilterExpression += 'and accountFrom = :a or accountTo = :a';
  }
  if (item.category) {
    FilterExpression += 'and category = :c';
  }
  const params = {
    TableName: 'transaction',
    IndexName: 'transactionLedgerIndex',
    KeyConditionExpression: 'ledger = :l and timeEpoch between :f and :t',
    FilterExpression,
    ExpressionAttributeValues: {
      ':l': ledger,
      ':f': item.timeFrom,
      ':t': item.timeTo,
      ':s': item.summary,
      ':a': item.account,
      ':c': item.category,
    },
    ScanIndexForward: false,
    ProjectionExpression: 'timeEpoch, summary, amount, accountFrom, accountTo, category, createUser, createDate',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  if (!data.Items.length) return [];
  const transactions = await processTransactions(data.Items);
  return transactions;
};

const getData = (user, event, context) => {
  switch (event.routeKey) {
    case 'GET /transaction/options': return getOptions(user);
    case 'PUT /transactions': return putTransaction(user, event, context);
    case 'POST /transactions': return queryTransactions(user, event);
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
