#!/usr/bin/env node

/**
 * The main application driver for BaeBae.
 */
'use strict'

const BaeBae  = require('../lib/baebae')
const winston = require('winston')

// initialize logger
const logger = new (winston.Logger)({
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

let bot = null
try {
  // initiate awesomeness
  bot = new BaeBae()
  bot.setLogger(logger)
  bot.initialize()
} catch (err) {
  logger.error(err.stack)
}

module.exports = bot
