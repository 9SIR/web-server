const ret	= require('../common/result_object');
const db	= require('../tools/postgresql_opt');
const crypt = require('../utils/encrypt');
const sms	= require('./third_sms_api');
// const log = require('../utils/logs');

function singleSMSBatchSendHandle(request, reply) {
	var ok = sms.singleSMSBatchSend(
		crypt.generateUUID(), request.body.phone, request.body.smsContent, '7777'
	);
	if (ok) {
		return reply.send(ret.successRetObj());
	} else {

	}
}

async function smsSendToPeerGroupHandle(request, reply) {
	var ok = sms.smsSendToPeerGroup();
	if (ok) {
		return reply.send(ret.successRetObj());
	} else {

	}
}

/**
 * 接收微呼平台上行短信内容推送，存在多条上行时，一次最多推送10条
 * @param {*} request [{"appkey":"huoguo","deliver_time":"2023-12-23 01:01:01","extend":"123","msg":"TD","phone":"xxxxxxxxxxx"}, ...]
 * @param {*} reply
 * @returns {"code":"00000"}
 */
async function receiveSMSContent(request, reply) {
	var data = [];
	var sms = request.body;
	for (var idx = 0, len = sms.length; idx < len; ++idx) {
		var content = {};
		// content.appkey = sms[i].appkey;
		content.uuid = crypt.generateUUID();
		content.extend_num = sms[idx].extend;
		content.phone = sms[idx].phone;
		content.content = sms[idx].msg;
		content.source = 1;
		content.send_time = sms[idx].deliver_time;
		data.push(content);
	}
	if (await db.insertSMSRecvFromWeiHu(data)) {
		return reply.send({ "code": "00000" }) //接收成功需返回{"code":"00000"}，返回其它值视为接收异常，会尝试最多推送三次
	} else {
		return reply.send({ "code": 'Failed' }) //TODO
	}
}

/**
 * 接收微呼平台的短信状态报告推送，存在多条上行时，一次最多推送100条
 * @param {*} request [{"appkey":"huoguo","desc":"DELIVRD","phone":"xxxxxxxxxxx","report_time":"2023-12-25 01:01:01","status":"2","uid":"xxx"}, ...]
 * 					  status: 0--成功，其它值表示失败
 * @param {*} reply
 * @returns {"code":"00000"}
 */
async function receiveStateReport(request, reply) {
	var smstate = request.body;
	var updateObjs = [];
	for (var idx = 0, len = smstate.length; idx < len; ++idx) {
		var obj = {};
		obj.uuid = smstate[idx].uid;
		obj.report_time = smstate[idx].report_time;
		if (smstate[idx].status == 0) {
			obj.status = 1; //发送成功
		} else {
			obj.status = 2; //发送失败
		}
		updateObjs.push(obj);
	}
	if (await db.updateSMSendStateFromWeiHu(updateObjs)) {
		return reply.send({ "code": "00000" }) //接收成功需返回{"code":"00000"}，返回其它值视为接收异常，会尝试最多推送三次
	} else {
		return reply.send({ "code": 'Failed' }) //TODO
	}
}

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
	/**
	 * 为第三方提供短信转发（相同内容群发至多个手机号）的接口
	 * 在接收到第三方的短信内容时，立即转发到微呼短信平台
	 */
	fastify.post('/sms/batch-deliver', options, async (request, reply) => {
		return singleSMSBatchSendHandle(request, reply);
	});

	/**
	 * 为第三方提供短信转发（向相同手机号发送多条短信）的接口
	 * 在接收到第三方的短信内容时，立即转发到微呼短信平台
	 */
	fastify.post('/sms/peer-deliver', options, async (request, reply) => {
		return smsSendToPeerGroupHandle(request, reply);
	});

	/**
	 * 用于接收微呼平台推送的短信内容
	 */
	fastify.post('/sms/weihu/content', options, async (request, reply) => {
		return receiveSMSContent(request, reply);
	});

	/**
	 * 用于接收微呼平台推送的短信发送状态报告
	 */
	fastify.post('/sms/weihu/state', options, async (request, reply) => {
		return receiveStateReport(request, reply);
	});

	fastify.get('/', options, async (request, reply) => {
		return reply.send({ 'status': 'ok' });
	})
}

module.exports = routes;