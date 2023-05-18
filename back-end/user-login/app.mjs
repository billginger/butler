import https from 'https';
import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from './libs/ddbDocClient.mjs';

const getApp = async () => {
  const params = {
    TableName: 'app',
    Limit: 1,
  };
  const data = await ddbDocClient.send(new ScanCommand(params));
  const item = data.Items?.[0];
  const app = {
    id: item?.id,
    secret: item?.secret,
  };
  return app;
};

const getSession = (appId, appSecret, code) => {
  const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code='
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

const getRegistered = async (openid) => {
  if (!openid) return false;
  const params = {
    TableName: 'user',
    Key: { openid },
  };
  const data = await ddbDocClient.send(new GetCommand(params));
  const registered = !!data.Item?.openid;
  return registered;
};

export const handler = async (event, context) => {
  try {
    const app = await getApp();
    const code = event.queryStringParameters?.code;
    const session = await getSession(app.id, app.secret, code);
    const registered = await getRegistered(session.openid);
    return {
      statusCode: 200,
      body: JSON.stringify({ registered }),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }
};
