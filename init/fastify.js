const pify = require('pify');

const fastify = require('fastify')({logger: true, ignoreTrailingSlash: true});
const cors = require('cors');

module.exports = async configs => {
  fastify.use(cors());

  fastify.setNotFoundHandler((request, reply) => {
    reply.redirect('https://github.com/simonepri/act');
  });

  try {
    await pify(fastify.listen)(configs.server.port);
  } catch (error) {
    throw error;
  }
};
