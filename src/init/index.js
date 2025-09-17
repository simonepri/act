import process from 'node:process';
import initGoogleAPI from './googleapi.js';

const init = async () => {
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
