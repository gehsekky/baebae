#!/usr/bin/env node
/**
 * The main application driver for BaeBae.
 */
'use strict'

var BaeBae = require('../lib/baebae')
let winston = require('winston')

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      showLevel:true,
      json: false,
      level: 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      dirname: 'logs',
      filename: 'baebae.log'
    })
  ]
})


try {
  // initiate awesomeness
  var bot = new BaeBae(logger)
  bot.initialize()
} catch (err) {
  logger.error(err.stack)
}

module.exports = bot
