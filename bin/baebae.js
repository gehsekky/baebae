#!/usr/bin/env node

'use strict'

var BaeBae = require('../lib/baebae')

try {
  var bot = new BaeBae()
  bot.initialize()
} catch ( e ) {
  console.log('error', e)
}

module.exports = bot
