const listen_port = 60080;

const fastify = require('fastify')({
	logger: { level: 'info', file: '/tmp/web-server.log' }
});

fastify.register(require('./service/sms_trsfer_service'));

function err_handle(err, address) {
	if (err) {
		process.exit(1);
	}
}

fastify.listen({ port: listen_port, host: '0.0.0.0' }, (err, address) => {
		err_handle(err, address);
	}
)
