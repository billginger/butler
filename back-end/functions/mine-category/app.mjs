import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient, getUser } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const createCategory = async (createUser, event, context) => {
  const { awsRequestId } = context;
  const { timeEpoch } = event.requestContext;
  const item = JSON.parse(event.body);
  item.id = awsRequestId;
  item.sort = 0;
  item.isHid = false;
  item.createUser = createUser;
  item.createDate = getMilliseconds(timeEpoch);
  const params = {
    TableName: 'category',
    Item: item,
  };
  await ddbDocClient.send(new PutCommand(params));
  return { id: awsRequestId };
};

const readCategories = async (createUser) => {
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

const getCategory = async (id, createUser) => {
  const params = {
    TableName: 'category',
    Key: { id },
  };
  const data = await ddbDocClient.send(new GetCommand(params));
  const category = data.Item;
  if (category.createUser != createUser) throw new Error('No permission!');
  return category;
};

const getHistory = (oldItem, newItem, event) => {
  const history = oldItem.history || [];
  const createDate = getMilliseconds(event.requestContext.timeEpoch);
  const data = { createDate };
  if (oldItem.direction != newItem.direction) {
    data.direction = oldItem.direction;
  }
  if (oldItem.label != newItem.label) {
    data.label = oldItem.label;
  }
  if (oldItem.isHid != newItem.isHid) {
    data.isHid = oldItem.isHid;
  }
  if (Object.keys(data).length > 1) {
    history.push(data);
  }
  return history;
};

const updateCategory = async (createUser, event) => {
  const { id } = event.pathParameters;
  const category = await getCategory(id, createUser);
  const item = JSON.parse(event.body);
  const history = getHistory(category, item, event);
  const params = {
    TableName: 'category',
    Key: { id },
    UpdateExpression: 'set direction = :d, label = :l, isHid = :i, history = :h',
    ExpressionAttributeValues: {
      ':d': item.direction,
      ':l': item.label,
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
    case 'PUT /categories': return createCategory(user.openid, event, context);
    case 'GET /categories': return readCategories(user.openid);
    case 'PUT /categories/{id}': return updateCategory(user.openid, event);
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
