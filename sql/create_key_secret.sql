DROP TABLE IF EXISTS key_secret; /* 如果表存在则删除 */

CREATE TABLE key_secret (
	id serial PRIMARY KEY,
	key VARCHAR(255) NOT NULL,
	secret VARCHAR(255) NOT NULL,
	update_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);

CREATE INDEX idx_key ON key_secret (key);		/* 为key字段添加唯一索引 */
CREATE INDEX idx_secret ON key_secret (secret); /* 为secret字段添加索引 */

COMMENT ON TABLE key_secret is 'AppKey/AppSecret存储表';
COMMENT ON COLUMN key_secret.id is '自增主键';
COMMENT ON COLUMN key_secret.key is 'AppKey';
COMMENT ON COLUMN key_secret.secret is 'AppSecret';

/* 氣象APP的AppKey和AppSecret */
INSERT INTO key_secret (key, secret) VALUES ('bd23d7e9f8034ec5bb886be860a9cc5e', '5f75e5ecb9b042f3a4b2f67cd9c73744');
