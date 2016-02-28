/**
 * A module for core irc commands
 */
'use strict'

let _            = require('lodash')
let BaeBaeModule = require('../baebae-module')

/**
 * This module contains core IRC functionality for BaeBae. Basic and
 * administrative commands are supported and should be localized to
 * this file/class.
 */
class Irc extends BaeBaeModule {
  init() {
    this.commands = {
      /**
       * Sets the topic of the channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      topic: function (bot, nick, channel, data) {
        console.log(`changed topic to ${data} in ${channel} by ${nick}`)
        bot.client.send('topic', channel, data)
      },
      /**
       * Gives someone (or more) ops
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      op: function (bot, nick, channel, data) {
        if ( !data ) {
          data = nick
        }

        console.log(`gave ops to ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '+' + getModeValue(data, 'o'), data)
      },
      /**
       * Removes ops from someone (or more)
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      deop: function (bot, nick, channel, data) {
        if ( !data ) {
          data = nick
        }

        console.log(`removed ops from ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '-' + getModeValue(data, 'o'), data)
      },
      /**
       * Gives voice to someone
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      voice: function (bot, nick, channel, data) {
        if ( !data ) {
          data = nick
        }

        console.log(`gave voice to ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '+' + getModeValue(data, 'v'), data)
      },
      /**
       * Removes voice from someone
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      devoice: function (bot, nick, channel, data) {
        if ( !data ) {
          data = nick
        }

        console.log(`removed voice from ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '-' + getModeValue(data, 'v'), data)
      },
      /**
       * Kicks user from channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      kick: function (bot, nick, channel, data) {
        var client, words, kicked, kickMsg
        client = bot.client

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

        console.log(`kicked ${kicked} from ${channel} by ${nick}`)
        client.send('kick', channel, kicked, kickMsg ? kickMsg : `You were kicked by ${nick}`)
      },
      /**
       * Joins channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      join: function (bot, nick, channel, data) {
        var client = bot.client

        if ( !data ) {
          client.say(channel, 'join which channel?')
          return
        }

        console.log(`invited to join channel ${data} from ${channel} by ${nick}`)
        client.join(data)
      },
      /**
       * Leaves channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      part: function ( bot, nick, channel, data ) {
        var client = bot.getClient()

        if ( !data ) {
          client.say(channel, 'leave which channel?')
          return
        }

        console.log(`parting channel ${data} from ${channel} by ${nick}`)
        client.part(data)
      },
      whois: function ( bot, nick, channel, data ) {
        console.log('nick', nick)
        if ( !data ) {
          data = nick
        }

        bot.client.whois(data, function (result) {
          var message = 'nothing found'
          if (result.host) {
            message = _.template('whois: ${user}@${host}${realname}')
            message = message({
              user: result.user,
              host: result.host,
              realname: result.realname ? ' (' + result.realname + ')' : ''
            })
          }

          console.info(`queried whois for ${data} in ${channel} by ${nick}`)
          console.log('whois data', message)
          bot.client.say(channel, message)
        })
      }
    }
  }
}

/**
 * Builds string for irc commands that need mode string to be proportional to arguments
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
 * Gets number of words in string
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

module.exports = Irc
