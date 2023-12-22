/**
 * 错误码分类：
 * 1、HTTP 请求相关：HP (HTTP Parameters)
 */
const retcode = {
	success: 0,
	phoneEmpty: '',
}

function successRetObj(smsSubmitUID) {
	return { "status": 0, "description": "提交成功", "uid": smsSubmitUID }
}

module.exports = {
	retcode,
	successRetObj,
};
