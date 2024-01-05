/**
 * 错误码分类：
 * 1、HTTP 请求相关：HP (HTTP Parameters)
 */
const RET_CODE = {
	success: 0,
	phoneEmpty: '',
}

function successRetObj(smsSubmitUID) {
	return { "status": 0, "description": "提交成功", "uid": smsSubmitUID }
}

module.exports = {
	RET_CODE,
	successRetObj,
};
