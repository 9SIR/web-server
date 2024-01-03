const crypt = require('../utils/encrypt');
const { Sequelize, DataTypes, NOW } = require('sequelize');

const dbName = 'qx_web_server';
const postgresUsername = 'postgres';
const postgresPasswd = 'postgres';

const sequelize = new Sequelize(dbName, postgresUsername, postgresPasswd, {
	host: '127.0.0.1',
	dialect: 'postgres', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' */
	username: postgresUsername,
	password: postgresPasswd,
	pool: {
		max: 4, /* Maximum number of connection in pool */
		min: 0, /* Minimum number of connection in pool */
		idle: 10000, /* The maximum time, in milliseconds, that a connection can be idle before being released. */
		acquire: 30000, /* The maximum time, in milliseconds, that pool will try to get connection before throwing error */
	}
});

const smsDetail = sequelize.define('sms_details', {
	// id:				{ type: DataTypes.BIGINT, primaryKey:true },		/* 自增主键 */
	uuid:			{ type: DataTypes.STRING(50), allowNull: false },		/* 短信唯一标识 */
	customer_num:	{ type: DataTypes.STRING(255), allowNull: true },		/* 客户编号 */
	extend_num:		{ type: DataTypes.STRING(50), allowNull: true },		/* 扩展号 */
	phone:			{ type: DataTypes.STRING(50), allowNull: false },		/* 手机号码 */
	area_code:		{ type: DataTypes.STRING(50), defaultValue: '+86' },	/* 手机号码区号 */
	content:		{ type: DataTypes.TEXT, allowNull: false },				/* 短信内容 */
	balance:		{ type: DataTypes.INTEGER, defaultValue: 0 },			/* 短信余额（剩余条数） */
	source:			{ type: DataTypes.SMALLINT },							/* 短信来源，1--接收，2--系统发送 */
	status:			{ type: DataTypes.SMALLINT, defaultValue: 0 },			/* 短信发送状态，0--默认值，1--发送成功，2--发送失败，3--未确认 */
	send_time:		{ type: DataTypes.DATE, defaultValue: DataTypes.NOW },	/* 接收或发送短信的时间 */
	report_time:	{ type: DataTypes.DATE, allowNull:true },				/* 短信发送状态更新时间 */
}, {
	timestamps: false /* 取消自动添加 createAt 和 updateAt 字段 */
});

/**
 * 往数据库 qx_web_server.sms_details 批量插入数据
 * @param {*} sms [{"", "", "", ...}, {"", "", "", ...}, ...]
 * @returns
 */
async function insertSMSRecvFromWeiHu(smsObjs) {
	try {
		await sequelize.transaction(async (t) => {
			await smsDetail.bulkCreate(smsObjs, { transaction: t })
		});
		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

/**
 * 批量更新短信发送状态
 * @param {*} updateAry [{ uuid:'xxx', updateOnField1: '1', updateOnField2: '2' }, ...]
 * @param {*} updateFields ["updateOnField1", "updateOnField2", ...]
 * @returns
 */
async function updateSMSendStateFromWeiHu(updateObjs) {
	console.log(updateObjs);
	try {
		await sequelize.transaction(async (t) => {
			for (var idx = 0, len = updateObjs.length; idx < len; ++idx) {
				await smsDetail.update(
					{ status: updateObjs[idx].status, report_time: updateObjs[idx].report_time },
					{ where: { uuid: [ updateObjs[idx].uuid ] } },
					{ transaction: t }
				);
			}
		});
		return true;
	} catch(error) {
		console.log(error);
		return false;
	}
}

module.exports = {
	insertSMSRecvFromWeiHu,
	updateSMSendStateFromWeiHu,
};