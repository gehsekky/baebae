/**
 * a silly module for printing butts
 * @module ModuleButts
 */

'use strict'

var _ = require('lodash')

/**
 * @class
 * @constructor
 */
function ModuleButts() {
  /**
   * @namespace
   */
  this.commands = {
    /**
     * print butts
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    butts: function ( bot, nick, channel, data ) {
      var client = bot.getClient()
      var randomNum = _.random(1, 100)
      console.log('randomNum', randomNum)
      var output = ''
      if ( randomNum === 100 ) {
        output = '))<>(('
      } else if ( randomNum % 2 === 0 ) {
        output = '))'
      } else {
        output = '(('
      }
      client.say(channel, output)
    }
  }
}

/**
 * required module initialize function
 * @param {object} bot a reference to the bot instance
 */
ModuleButts.prototype.initialize = function ( bot ) {

}

module.exports = ModuleButts
