import logger from 'simple-node-logger'
export default logger.createRollingFileLogger({
	logDirectory: 'logs',
	fileNamePattern: '<date>.log',
	dateFormat: 'YYYY.MM.DD',
})