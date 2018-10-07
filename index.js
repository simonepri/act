const init = require('./init');

async function run() {
  await init.env();

  const configs = {};

  configs.server = {
    port: process.env.server_port || 80
  };

  await init.fastify(configs);
}

Promise.resolve()
  .then(() => run())
  .catch(console.error);
