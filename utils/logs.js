const pino = require("pino");

const logInfoFile = '/tmp/logs/info.log';
const logErrFile = '/tmp/logs/error.log';

const streams = [
	{ level: "error", stream: `${logErrFile}` },
	{ level: "info",  stream: `${logInfoFile}` },
];

const logger = pino(
	pino.destination({ minLength: 4096, sync: false }),
	pino.multistream(streams),
);

function info(msg) {
	logger.info(msg);
}

module.exports = {
	info,
};
