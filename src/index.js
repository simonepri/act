const init = require('./init');

async function run() {
  await init.env();

  const configs = {};

  configs.credentials = {
    googleapi: {
      email: process.env.googleapi_client_email,
      key: Buffer.from(process.env.googleapi_private_key_b64, 'base64').toString('utf-8')
    }
  };

  configs.auths = {
    googleapi: await init.googleapi(configs)
  };

  configs.server = {
    port: process.env.server_port || 80
  };

  await init.fastify(configs);
}

Promise.resolve()
  .then(() => run())
  .catch(console.error);
