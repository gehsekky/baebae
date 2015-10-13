/**
 * a module for core irc commands
 * @module ModuleIrc
 */

'use strict'

var _ = require('lodash')

/**
 * @class
 * @constructor
 */
function ModuleIrc() {
  /**
   * @namespace
   */
  this.commands = {
    /**
     * sets topic
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    topic: function ( bot, nick, channel, data ) {
      console.log('changed topic to ' + data + ' in ' + channel + ' by ' + nick)
      bot.getClient().send('topic', channel, data)
    },
    /**
     * gives someone (or more) ops
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    op: function ( bot, nick, channel, data ) {
      if ( !data ) {
        data = nick
      }

      console.log('applied ops to ' + data + ' in ' + channel + ' by ' + nick)
      bot.getClient().send('mode', channel, '+' + getModeValue(data, 'o'), data)
    },
    /**
     * removes ops from someone (or more)
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    deop: function ( bot, nick, channel, data ) {
      if ( !data ) {
        data = nick
      }

      console.log('removed ops from ' + data + ' in ' + channel + ' by ' + nick)
      bot.getClient().send('mode', channel, '-' + getModeValue(data, 'o'), data)
    },
    /**
     * gives voice to someone
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    voice: function ( bot, nick, channel, data ) {
      if ( !data ) {
        data = nick
      }

      console.log('gave voice to ' + data + ' in ' + channel + ' by ' + nick)
      bot.getClient().send('mode', channel, '+' + getModeValue(data, 'v'), data)
    },
    /**
     * removes voice from someone
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    devoice: function ( bot, nick, channel, data ) {
      if ( !data ) {
        data = nick
      }

      console.log('removed voice from ' + data + ' in ' + channel + ' by ' + nick)
      bot.getClient().send('mode', channel, '-' + getModeValue(data, 'v'), data)
    },
    /**
     * kicks user from channel
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    kick: function ( bot, nick, channel, data ) {
      var client, words, kicked, kickMsg
      client = bot.getClient()

      if ( !data ) {
        client.say(channel, 'kick who?')
        return
      }

      kicked = data
      kickMsg = ''
      words = data.split(' ')
      if (words.length > 1) {
        kicked = words[0]
        words.splice(0, 1)
        kickMsg = words.join(' ')
      }

      console.log('kicked ' + kicked + ' from ' + channel + ' by ' + nick)
      client.send('kick', channel, kicked, kickMsg ? kickMsg : 'You were kicked by ' + nick)
    }
  }
}

/**
 * builds string for irc commands that need mode string to be proportional to arguments
 * @param {number} num The number of names following commands
 * @param {string} mode The requested mode
 * @return {string} String with proper number of modes to match number of users
 */
function getModeValue(data, mode) {
  var output, i, len, num
  num = getNumberOfItems(data)
  output = ''
  for (i = 0; i < num; i++) {
    output += mode
  }
  return output
}

/**
 * get number of words in string
 * @param {string} data The input
 * @return {number} The number of words in input
 */
function getNumberOfItems(data) {
  var arr, num, i, len
  data = _.trim(data)
  arr = data.split(' ')
  num = 0
  for (i = 0, len = arr.length; i < len; i++) {
    if (arr[i]) {
      num++
    }
  }
  return num
}

/**
 * required module initialize function
 * @param {object} bot a reference to the bot instance
 */
ModuleIrc.prototype.initialize = function ( bot ) {

}

module.exports = ModuleIrc
