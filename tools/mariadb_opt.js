const mariadb = require('mariadb');

const database	= 'qx_data';
const sms_table = 'customer_sms_details';

/**
 * Initialize Connection Pool
 */
const pool = mariadb.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "qx.123",
	database: "qx_data",
	connectionLimit: 4
});

/**
 * Fetch Connection
 * @returns Mariadb connection
 */
async function fetchConn() {
	let conn = await pool.getConnection();
	return conn;
}

/**
 * 往数据库 qx_data.customer_sms_details 批量插入数据
 * @param {*} data [["", "", "", ...], ["", "", "", ...], ...]
 * @returns
 */
async function insertSMSRecvFromWeiHu(data) {
	let conn;
	let ret = false;
	try {
		conn = await fetchConn();
		await conn.beginTransaction();
		await conn.batch(
			"INSERT INTO qx_data.customer_sms_details(phone,content,extend_num,send_time) VALUES(?,?,?,?)",
			data
		);
		await conn.commit();
		ret = true;
	} catch(err) {
		console.log(err);
		await conn.rollback();
	} finally {
		if (conn) conn.release();
	}
	return ret;
}

/**
 * 批量更新短信发送状态
 * @param {*} updateSQL 更新语句
 */
async function updateSMSendState(updateSQL) {
	let conn;
	let ret = false;
	try {
		conn = await fetchConn();
		await conn.beginTransaction();
		await conn.execute(updateSQL)
		conn.commit();
		ret = true;
	} catch(err) {
		console.log(err);
		await conn.rollback();
	} finally {
		if (conn) conn.release();
	}
}

module.exports = {
	database,
	sms_table,
	insertSMSRecvFromWeiHu,
	updateSMSendState,
};