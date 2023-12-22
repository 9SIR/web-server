const uuid	= require('uuid-random');
const ret	= require('../common/result_object');
const db	= require('../tools/mariadb_opt');
const sms	= require('./third_sms_api');
// const log = require('../utils/logs');

function singleSMSBatchSendHandle(request, reply) {
	var ok = sms.singleSMSBatchSend(
				request.body.phone, request.body.smsContent);
	if (ok) {
		return reply.send(ret.successRetObj());
	} else {

	}
}

async function smsSendToPeerGroupHandle(request, reply) {
	return sms.smsSendToPeerGroup();
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
	fastify.post('/single-sms-batchsend', options, async (request, reply) => {
		return singleSMSBatchSendHandle(request, reply);
	});
	fastify.post('/sms-to-peergroup', options, async (request, reply) => {
		return smsSendToPeerGroupHandle(request, reply);
	});
	fastify.get('/', options, async (request, reply) => {
		console.log(uuid().replaceAll('-', ''));
		return { "UUID": uuid().replaceAll('-', '') };
	})
}

module.exports = routes;