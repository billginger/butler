import https from 'https';
import { ddbDocClient } from 'layer-ddb';
import { getMilliseconds } from 'layer-date';
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

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
  const tokenExpires = getMilliseconds(requestContext.requestTimeEpoch) + 864e5;
  const params = {
    TableName: 'user',
    Key: { openid },
    ConditionExpression: 'attribute_exists(openid)',
    UpdateExpression: 'set tokenCode = :tc, tokenExpires = :te',
    ExpressionAttributeValues: {
      ':tc': tokenCode,
      ':te': tokenExpires,
    },
    ReturnValues: 'ALL_NEW',
  };
  const data = await ddbDocClient.send(new UpdateCommand(params));
  const token = data.Attributes.tokenCode;
  return token;
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
