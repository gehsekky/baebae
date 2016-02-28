#!/usr/bin/env node
/**
 * The main application driver for BaeBae.
 */
'use strict'

var BaeBae = require('../lib/baebae')
let log4js = require('log4js')

log4js.replaceConsole()

try {
  // initiate awesomeness
  var bot = new BaeBae()
  bot.initialize()
} catch (err) {
  console.error(err)
}

module.exports = bot
