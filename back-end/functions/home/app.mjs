import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';

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
    ProjectionExpression: 'timeEpoch, summary, amount, accountFrom, accountTo, ledger, createDate',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  const transaction = data.Items[0];
  return transaction;
};

const getAccounts = async (transaction) => {
  if (!transaction) return [];
  const params = {
    TableName: 'account',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u',
    ExpressionAttributeValues: {
      ':u': transaction.ledger,
    },
    ProjectionExpression: 'id, currency',
  };
  const data = await ddbDocClient.send(new QueryCommand(params));
  const accounts = data.Items;
  delete transaction.ledger;
  return accounts;
};

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    const transaction = await getTransaction(user.openid);
    const accounts = await getAccounts(transaction);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          nickname: user.nickname,
        },
        transaction,
        accounts,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify(err.message),
    };
  }
};
