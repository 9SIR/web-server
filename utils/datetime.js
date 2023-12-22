/**
 * Get currently local timestemp
 * @returns currently local timestemp
 */
function getLocalTimestamp() {
	return new Date().getTime();
}

/**
 * Get currently local datetime string
 * @returns Date time string
 */
function getCurLocalTimeString() {
	return new Date().toLocaleString();
}

module.exports = {
	getLocalTimestamp,
	getCurLocalTimeString,
};