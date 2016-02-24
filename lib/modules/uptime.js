/**
 * tells how long the bot has been up
 * @module ModuleUptime
 */
'use strict'

var moment = require('moment')

var loadTime = null

/**
 * @class
 * @constructor
 */
function ModuleUptime() {
  /**
   * @namespace
   */
  this.commands = {
    /**
     * say how long the bot has been up
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    uptime: function (bot, nick, channel, data) {
      bot.client.say(channel, 'I\'ve been up for ' + moment.duration(moment().diff(loadTime)).humanize())
    }
  }
}

/**
 * initialize module
 * @param {object} bot A reference to the bot
 */
ModuleUptime.prototype.initialize = function ( bot ) {
  loadTime = new moment()
}

module.exports = ModuleUptime
