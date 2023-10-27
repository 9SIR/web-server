async function root_req_handle(request, reply) {
	return { hello: 'world' }
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
	fastify.get('/', async (request, reply) => {
		return root_req_handle(request, reply)
	})
}

module.exports = routes
