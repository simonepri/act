import process from 'node:process';
import initEnv from './env.js';
import initGoogleAPI from './googleapi.js';

const init = async () => {
  await initEnv();

  const configs = {};

  configs.auths = {
    googleapi: await initGoogleAPI({
      email: process.env.GOOGLEAPI_CLIENT_EMAIL,
      key: process.env.GOOGLEAPI_PRIVATE_KEY,
    }),
  };

  return configs;
};

export default init;
