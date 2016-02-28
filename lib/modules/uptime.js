/**
 * Tells how long the bot has been up
 * @module ModuleUptime
 */
'use strict'

let moment = require('moment')
let BaeBaeModule = require('../baebae-module')

// internally cached start time
let loadTime = null

/**
 * This module provides basic uptime information.
 */
class Uptime extends BaeBaeModule {
  init(bot) {
    this.commands = {
      /**
       * Says how long the bot has been up
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      uptime: function (bot, nick, channel, data) {
        let diff = moment().diff(loadTime, 'seconds')
        let humanspeak = moment.duration(moment().diff(loadTime)).humanize()
        bot.client.say(channel, `I've been up for ${humanspeak} (${diff}s)`)
      }
    }

    // initialize the cached start time
    loadTime = moment()
  }
}

module.exports = Uptime
