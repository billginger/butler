import https from 'https';

const getOpenid = (appid, secret, code) => {
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=
    authorization_code`;
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
