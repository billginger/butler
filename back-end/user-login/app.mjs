import https from 'https';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from './libs/ddbDocClient.mjs';

const params = {
  TableName: 'app',
  Limit: 1,
};

const getApp = async () => {
  const data = await ddbDocClient.send(new ScanCommand(params));
  const item = data.Items?.[0];
  const app = {
    id: item?.id,
    secret: item?.secret,
  };
  return app;
};

const getOpenid = (appId, appSecret, code) => {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}
    &grant_type=authorization_code`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = '';
      res.on('data', chunk => {
        rawData += chunk;
      });
      res.on('end', () => {
        resolve(rawData);
      });
    });
    req.on('error', err => {
      reject(new Error(err));
    });
  });
};

export const handler = async (event, context) => {
  try {
    const app = await getApp();
    console.log(JSON.stringify(app));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'hi~'
      })
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
