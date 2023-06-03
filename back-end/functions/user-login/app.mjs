import https from 'https';
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';

const getApp = async () => {
  const params = {
    TableName: 'app',
    Limit: 1,
  };
  const data = await ddbDocClient.send(new ScanCommand(params));
  const app = data.Items[0];
  return app;
};

const getSession = (app, code) => {
  const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.id + '&secret=' + app.secret + '&js_code='
    + code + '&grant_type=authorization_code';
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(rawData));
      });
    });
    req.on('error', err => {
      reject(new Error(err));
    });
  });
};

const getToken = async (openid, requestContext) => {
  const tokenCode = requestContext.requestId.replace(/-/g, '');
  const loginDate = getMilliseconds(requestContext.timeEpoch);
  const params = {
    TableName: 'user',
    Key: { openid },
    ConditionExpression: 'attribute_exists(openid)',
    UpdateExpression: 'set tokenCode = :c, loginDate = :d',
    ExpressionAttributeValues: {
      ':c': tokenCode,
      ':d': loginDate,
    },
  };
  await ddbDocClient.send(new UpdateCommand(params));
  return tokenCode;
};

export const handler = async (event) => {
  try {
    const app = await getApp();
    const { code } = event.queryStringParameters;
    const session = await getSession(app, code);
    const token = await getToken(session.openid, event.requestContext);
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
