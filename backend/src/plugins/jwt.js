const fastifyJwt = require("@fastify/jwt");

async function jwtPlugin(fastify, options) {
  await fastify.register(fastifyJwt, {
    secret: options.jwtSecret,
  });

  fastify.decorate("authenticate", async function authenticate(request) {
    await request.jwtVerify();
  });
}

module.exports = jwtPlugin;
