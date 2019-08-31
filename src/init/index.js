const init = {
  env: require('./env.js'),
  googleapi: require('./googleapi.js')
};

module.exports = async () => {
  await init.env();

  const configs = {};

  configs.auths = {
    googleapi: await init.googleapi({
      email: process.env.googleapi_client_email,
      key: Buffer.from(process.env.googleapi_private_key_b64, 'base64').toString('utf-8')
    })
  };

  return configs;
};
