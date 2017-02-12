#!/usr/bin/env node

/**
 * The main application driver for BaeBae.
 */
'use strict'

const logger = require('../lib/components/logger')
const BaeBae  = require('../lib/baebae')

let bot = null

try {
  // initiate awesomeness
  bot = new BaeBae()
  bot.initialize()
} catch (err) {
  logger.error(err.stack)
}

module.exports = bot
