const mariadb = require('mariadb');

/**
 * Initialize Connection Pool
 */
const pool = mariadb.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "root",
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
 *
 * @param {*} data [["", "", "", ...], ["", "", "", ...], ...]
 * @returns
 */
async function insertSMSContent(data) {
	let conn;
	try {
		conn = await fetchConn();
		var rows =  await conn.batch(
			"INSERT INTO qx_data.customer_sms_details() VALUES()",
			data
		);
		conn.commit();
		return true;
	} catch(err) {
		console.log(err);
		return false;
	} finally {
		if (conn) conn.release();
	}
}

module.exports = {
	insertSMSContent,
};