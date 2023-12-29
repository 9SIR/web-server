const crypto = require('crypto');
const uuid = require('uuid-random');

/**
 * 生成MD5哈希值
 */
async function generateMD5(code) {
	var md5 = crypto.createHash('md5');
	return md5.update(code).digest('hex');
}

/**
 * 扩展号总长度
 */
const defTotalBit = 10;

/**
 * 生成扩展号：0000000001~9999999999
 * 从 1 开始，新的扩展号在旧的扩展号基础上 +1，在前面补零
 * @param {*} latestExtend 最后生成的扩展号
 * @returns 新的扩展号
 */
async function generExtendNum(latestExtend) {
	var latest = parseInt(latestExtend);
	var newest = latest + 1;
	var existBit = newest.toString().length;
	var fillWith = defTotalBit - existBit;

	var extCode = '';
	for (let idx = 0; idx < fillWith; ++idx) {
		extCode += '0';
	}
	return extCode += newest;
}

/**
 * 生成一个不带 - 的UUID
 * @returns UUID
 */
function generateUUID() {
	return uuid().replaceAll('-', '')
}

module.exports = {
	generateMD5,
	generExtendNum,
	generateUUID,
};