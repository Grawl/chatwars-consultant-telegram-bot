import logger from 'simple-node-logger'
module.exports = logger.createRollingFileLogger({
	logDirectory: 'logs',
	fileNamePattern: '<date>.log',
	dateFormat: 'YYYY.MM.DD',
})