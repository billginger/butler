import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser, getAccounts } from 'layer-ddb';

const getTransaction = async (createUser) => {
  const params = {
    TableName: 'transaction',
    IndexName: 'userIndex',
    KeyConditionExpression: 'createUser = :u and createDate > :d',
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

const processAccounts = async (transaction) => {
  if (!transaction) return [];
  const accounts = await getAccounts(transaction.ledger, 'id, currency');
  delete transaction.ledger;
  return accounts;
};

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    const transaction = await getTransaction(user.openid);
    const accounts = await processAccounts(transaction);
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
