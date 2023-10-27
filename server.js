const listen_port = 30080
const listen_addr = "127.0.0.1"

const fastify = require('fastify')({
	logger: true
})

fastify.register(
	require('./service/root-service')
)

function err_handle(err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

fastify.listen(
	{port: listen_port, address: listen_addr},
	function (err, address) {
		err_handle(err, address);
	}
)
