const winston = require('winston')

let _logger = null;

/**
 * Gets the current logger instance and creates it if necessary
 */
function getLogger() {
  // if logger object doesn't already exist, create it
  if (!_logger) {
    _logger = new (winston.Logger)({
      transports: [
        // write to console
        new (winston.transports.Console)({
          colorize: true,
          showLevel:true,
          json: false,
          level: 'info'
        }),

        // write to daily rotation log file
        new (require('winston-daily-rotate-file'))({
          dirname: 'logs',
          filename: 'baebae.log'
        })
      ]
    })
  }

  // return logger instance
  return _logger
}

module.exports = getLogger()