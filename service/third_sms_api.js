/**
 * 第三方短信平台（微呼）接口
 */

/**
 * Return Code		Description
 * 00000			提交成功
 * F0001			参数appkey未填写
 * F0002			参数appcode未填写
 * F0003			参数phone未填写
 * F0004			参数sign未填写
 * F0005			参数timestamp未填写
 * F0006			appkey不存在
 * F0007			账号已经关闭
 * F0008			sign检验错误
 * F0009			账号下没有业务
 * F0010			业务不存在
 * F0011			手机号码超过1000个
 * F0012			timestamp不是数字
 * F0013			timestamp过期超过5分钟
 * F0014			请求ip不在白名单内
 * F0015			余额不足
 * F0016			手机号码无效
 * F0017			没有可用的业务
 * F0022			参数msg未填写
 * F0023			msg超过了1000个字
 * F0024			extend不是纯数字
 * F0025			内容签名未报备/无签名
 * F0039			参数sms未填写
 * F0040			参数sms格式不正确
 * F0041			短信条数超过1000条
 * F0050			无数据
 * F0100			未知错误
 */
const axios		= require('axios');
const datime	= require('../utils/datetime');
const encrypt	= require('../utils/encrypt');

const appkey		= '600073';
const appsecret		= 'iNhCPE';
const appcode		= '1000';
const SuccessCode	= '00000';
const smsHead		= '【柒星通信】';
const smsTail		= '拒收请回复R';

const SingleSMSBatchSendURL = 'http://47.93.60.171:9090/sms/batch/v1';		/* 相同内容群发接口 */
const SMSSendToPeerGroupURL = 'http://47.93.60.171:9090/sms/distinct/v1';	/* 一对一内容群发接口 */
const GetSMStateReportURL	= 'http://47.93.60.171:9090/sms/report/v1';		/* 状态报告用户自取接口 */
const FetchSMSContentURL	= 'http://47.93.60.171:9090/sms/mo/v1';			/* 上行用户自取 */
const QuerySMSBalanceURL	= 'http://47.93.60.171:9090/sms/balance/v1';	/* 查询余额 */

/**
 * 生成短信平台接口请求参数：sign
 * @param {*} key 应用key
 * @param {*} secret 应用秘钥
 * @param {*} timestamp 毫秒时间戳
 * @returns api param: sign
 */
async function generateSign(key, secret, timestamp) {
	return encrypt.generateMD5(key + secret + timestamp);
}

/**
 * 第三方短信平台接口 Http 请求封装
 * @param {*} url 第三方短信平台接口地址
 * @param {*} data 第三方短信平台接口参数
 * @returns true/false
 */
async function thirdPartAPIRequest(url, data) {
	axios.default.post(url, data).then(function (response) {
		console.log(response.data);
		if (response.data.code === SuccessCode) {
			return true;
		} else {
			console.log(response);
			return false;
		}
	}).catch(function (error) {
		console.log(error);
		return false;
	})
}

/**
 * 相同内容群发, 返回code值为: 00000 表示成功，否则失敗
 * 请求头需要设置传输格式: Content-type:application/json
 * @param {*} uid: 唯一标识符，32位字符串以内，用于获取短信回执，不传或传空系统自动生成
 * @param {*} phoneNum: 接收短信的手机号码，多个号码用逗号隔开，一次最多不能超过 1000 个
 * @param {*} msg: 短信内容, 内容长度不能超过 1000 个字（包括1000字），一个英文或数字算一个字
 * @param {*} extendCode: 扩展号，显示在接收手机上的主叫尾号
 * @returns {"code": "00000", "desc": "提交成功", "uid": "xxx", "result": [{"status": "00000", "phone": "xxxxxxxxxxx", "desc": "提交成功"}, ...]}
 */
async function singleSMSBatchSend(uid, phoneNum, msg, extendCode) {
	var timestamp = datime.getLocalTimestamp();
	var sign = await generateSign(appkey, appsecret, timestamp);
	var ret = thirdPartAPIRequest(SingleSMSBatchSendURL, {
		"uid": uid,
		"appkey": appkey,
		"appcode": appcode,
		"sign": sign,
		"phone": phoneNum,
		"extend": extendCode,
		"msg": smsHead + msg,
		"timestamp": timestamp
	});
	if (!ret) {

	}
	return ret;
}

/**
 * 一对一内容群发, 返回code值为: 00000 表示成功，否则失敗
 * 请求头需要设置传输格式: Content-type:application/json
 * @param {*} sms 个性化短信，数量不能超过1000条；"sms":[{"msg":"短信内容","phone":"xxxxxxxxxxx","extend":""},...]
 * @returns {"code": "00000","desc":"提交成功","result":[{"status":"00000","phone":"xxxxxxxxxxx","desc":"提交成功","uid":"xxx"}, ...]}
 */
async function smsSendToPeerGroup(sms) {
	var timestamp = datime.getLocalTimestamp(); //时间戳（精确到毫秒），5分钟内有效
	var sign = generateSign(appkey, appsecret, timestamp);
	var ret = thirdPartAPIRequest(SMSSendToPeerGroupURL, {
		"appkey": appkey,
		"appcode": appcode,
		"sign": sign,
		"sms": sms,
		"timestamp": timestamp
	});
	if (!ret) {

	}
	return ret;
}

/**
 * 状态报告用户自取，同一条数据只能获取一次，可通过参数获取指定数量
 * @param {*} number 可为空，数字，范围 1~1000，不在该范围采用默认值：200
 * @returns [{"appkey":"huoguo","desc":"DELIVRD","phone":"xxxxxxxxxxx","status":"0","uid":"xxxxxxxxxxx","report_time":"2023-12-20 01:01:00"}, ...]
 * 			status: 0--成功，其它值为失敗，report_time: 状态报告时间
 */
async function getSMStateReport(number) {
	var timestamp = datime.getLocalTimestamp(); //时间戳（精确到毫秒），5分钟内有效
	var sign = generateSign(appkey, appsecret, timestamp);
	var ret = thirdPartAPIRequest(GetSMStateReportURL, {
		"appkey": appkey,
		"appcode": appcode,
		"sign": sign,
		"number": number,
		"timestamp": timestamp
	});
	if (!ret) {

	}
	return ret;
}

/**
 * 上行用户自取，同一条数据只能获取一次，可通过参数获取指定数量
 * @param {*} number 可为空，数字，范围 1~1000，不在该范围采用默认值：200
 * @returns [{"appkey":"huoguo","phone":"xxxxxxxxxxx","extend":"123","msg":"TD","deliver_time":"2023-12-20 01:01:01"}, ...]
 * 			extend: 扩展号，对应发送填写的 extend；deliver_time: 上行回复时间
 */
async function fetchSMSContent(number) {
	var timestamp = datime.getLocalTimestamp(); //时间戳（精确到毫秒），5分钟内有效
	var sign = generateSign(appkey, appsecret, timestamp);
	var ret = thirdPartAPIRequest(FetchSMSContentURL, {
		"appkey": appkey,
		"appcode": appcode,
		"sign": sign,
		"number": number,
		"timestamp": timestamp
	});
	if (!ret) {

	}
	return ret;
}

/**
 * 查询账号余额，单位为：条（剩余可发送短信条数）
 * @returns [{"appkey":"test","balance":"50","balance_time":"2023-12-20 01:01:01"}, ...]
 */
async function querySMSBalance() {
	var timestamp = datime.getLocalTimestamp(); //时间戳（精确到毫秒），5分钟内有效
	var sign = generateSign(appkey, appsecret, timestamp);
	var ret = thirdPartAPIRequest(QuerySMSBalanceURL, {
		"appkey": appkey,
		"appcode": appcode,
		"sign": sign,
		"timestamp": timestamp
	});
	if (!ret) {

	}

	return ret;
}

module.exports = {
	singleSMSBatchSend,
	smsSendToPeerGroup,
	getSMStateReport,
	fetchSMSContent,
	querySMSBalance,
};