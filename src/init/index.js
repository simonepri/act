import process from 'node:process';
import {Buffer} from 'node:buffer';
import env from './env.js';
import googleapi from './googleapi.js';

const init = async () => {
  await env();

  const configs = {};

  configs.auths = {
    googleapi: await googleapi({
      email: process.env.googleapi_client_email,
      key: Buffer.from(
        process.env.googleapi_private_key_b64,
        'base64',
      ).toString('utf8'),
    }),
  };

  return configs;
};

export default init;
