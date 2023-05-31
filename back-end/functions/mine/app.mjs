import { getUser } from 'layer-ddb';

export const handler = async (event) => {
  try {
    const user = await getUser(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          nickname: user.nickname,
          withUser: !!user.withUser,
        },
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
