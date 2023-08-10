import JWT from 'jsonwebtoken';

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
  try {
    // access Token:
    const accessToken = JWT.sign(payload, privateKey, {
      expiresIn: '2 days',
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify::', err);
      } else {
        console.log('decode verify::', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

export { createTokenPair };
