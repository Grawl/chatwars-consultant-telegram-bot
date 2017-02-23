const logger = require('simple-node-logger')
module.exports = logger.createRollingFileLogger({
	logDirectory: 'logs',
	fileNamePattern: '<date>.log',
	dateFormat: 'YYYY.MM.DD',
})