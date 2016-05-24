/**
 * A module for core irc commands
 */
'use strict'

let BaeBaeModule = require('../baebae-module')

/**
 * This module contains core IRC functionality for BaeBae. Basic and
 * administrative commands are supported and should be localized to
 * this file/class.
 */
class Irc extends BaeBaeModule {
  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init() {
    this.commands = {
      /**
       * Sets the topic of the channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      topic: function (bot, nick, channel, data) {
        bot.logger.info(`changed topic to ${data} in ${channel} by ${nick}`)
        bot.client.send('topic', channel, data)
      },

      /**
       * Gives someone (or more) ops
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      op: function (bot, nick, channel, data) {
        if (!data) {
          data = nick
        }

        data = data.trim()

        bot.logger.info(`gave ops to ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '+' + getModeValue(data, 'o'), data)
      },

      /**
       * Removes ops from someone (or more)
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      deop: function (bot, nick, channel, data) {
        if (!data) {
          data = nick
        }

        data = data.trim()

        bot.logger.info(`removed ops from ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '-' + getModeValue(data, 'o'), data)
      },

      /**
       * Gives voice to someone
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      voice: function (bot, nick, channel, data) {
        if (!data) {
          data = nick
        }

        data = data.trim()

        bot.logger.info(`gave voice to ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '+' + getModeValue(data, 'v'), data)
      },

      /**
       * Removes voice from someone
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      devoice: function (bot, nick, channel, data) {
        if (!data) {
          data = nick
        }

        data = data.trim()

        bot.logger.info(`removed voice from ${data} in ${channel} by ${nick}`)
        bot.client.send('mode', channel, '-' + getModeValue(data, 'v'), data)
      },

      /**
       * Kicks user from channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      kick: function (bot, nick, channel, data) {
        let client = bot.client,
          parts, kicked, kickMsg

        if (!data) {
          client.say(channel, 'kick who?')
          return
        }

        kicked = data.trim()
        kickMsg = ''
        parts = kicked.split(/\s+/)
        if (parts.length > 1) {
          kicked = parts[0]
          parts.splice(0, 1)
          kickMsg = parts.join(' ')
        }

        bot.logger.info(`kicked ${kicked} from ${channel} by ${nick}`)
        client.send('kick', channel, kicked, kickMsg ? kickMsg : `You were kicked by ${nick}`)
      },

      /**
       * Joins channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      join: function (bot, nick, channel, data) {
        let client = bot.client

        if (!data) {
          client.say(channel, 'join which channel?')
          return
        }

        data = data.trim()

        bot.logger.info(`invited to join channel ${data} from ${channel} by ${nick}`)
        client.join(data)
      },

      /**
       * Leaves channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      part: function (bot, nick, channel, data) {
        var client = bot.getClient()

        if (!data) {
          client.say(channel, 'leave which channel?')
          return
        }

        data = data.trim()

        bot.logger.info(`parting channel ${data} from ${channel} by ${nick}`)
        client.part(data)
      },

      /**
       * Request information on user
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      whois: function ( bot, nick, channel, data ) {
        if (!data) {
          data = nick
        }

        bot.client.whois(data, result => {
          let message = 'nothing found'
          if (result.host) {
            let realname = result.realname ? ` (${result.realname})` : ''
            message = `whois: ${result.user}@${result.host}${realname}`
          }

          bot.logger.info(`queried whois for ${data} in ${channel} by ${nick}`)
          bot.logger.info('whois data', message)
          bot.client.say(channel, message)
        })
      }
    }
  }
}

/**
 * Builds string for irc commands that need mode string to be proportional to arguments.
 * Example: "!devoice user1 user2" would be transformed to "mode -vv user1 user2"
 * This function builds the "vv" part of the command.
 * @param {number} data The name, or list of names, following the command
 * @param {string} mode The requested mode
 * @return {string} String with proper number of modes to match number of users
 */
function getModeValue(data, mode) {
  var output, i, num
  num = data.trim().split(/\s+/).filter(item => { return !!item }).length
  output = ''
  for (i = 0; i < num; i++) {
    output += mode
  }
  return output
}

module.exports = Irc
