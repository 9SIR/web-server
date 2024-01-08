DROP TABLE IF EXISTS sms_details; /* 如果表存在则删除 */

CREATE TABLE sms_details (
	id serial PRIMARY KEY,
	uuid VARCHAR(50),
	customer_num VARCHAR(255) DEFAULT '',
	extend_num VARCHAR(50) DEFAULT '',
	area_code VARCHAR(50) DEFAULT '+86',
	phone TEXT NOT NULL CHECK (phone <> ''),
	content TEXT NOT NULL CHECK (content <> ''),
	balance INT CHECK (balance >= 0),
	source SMALLINT NOT NULL CHECK (status >= 0),
	status SMALLINT CHECK (status >= 0),
	send_time TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
	report_time TIMESTAMP
);

CREATE INDEX idx_sms_uuid ON sms_details (uuid); /* 为uuid字段添加唯一索引 */
CREATE INDEX idx_sms_phone ON sms_details (phone); /* 为phone字段添加索引 */

CREATE EXTENSION pg_trgm;
CREATE INDEX CONCURRENTLY idx_sms_content ON sms_details USING GIN (content gin_trgm_ops); /* 为content字段添加倒排索引 */

COMMENT ON TABLE sms_details is '短信收发详情表';
COMMENT ON COLUMN sms_details.id is '自增主键';
COMMENT ON COLUMN sms_details.uuid is '短信唯一标识';
COMMENT ON COLUMN sms_details.customer_num is '客户编号';
COMMENT ON COLUMN sms_details.extend_num is '扩展号';
COMMENT ON COLUMN sms_details.area_code is '手机号码区号';
COMMENT ON COLUMN sms_details.phone is '手机号码，多个号码用逗号隔开,最多不超过1000个号码';
COMMENT ON COLUMN sms_details.content is '短信内容';
COMMENT ON COLUMN sms_details.balance is '短信余额（剩余条数）';
COMMENT ON COLUMN sms_details.source is '短信来源，1--接收，2--系统发送';
COMMENT ON COLUMN sms_details.status is '短信发送状态，0--默认值，1--发送成功，2--发送失败，3--未确认';
COMMENT ON COLUMN sms_details.send_time is '接收或发送短信的时间';
COMMENT ON COLUMN sms_details.report_time is '短信发送状态更新时间';
