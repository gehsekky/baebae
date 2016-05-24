/**
 * Yet another seen module
 * @module ModuleSeen
 */
'use strict'

let config       = require('config')
let BaeBaeModule = require('../baebae-module')
let seenDb       = require('./seen/db')

/**
 * A module that passively records the last time a user was seen based off of
 * irc network events.
 */
class Seen extends BaeBaeModule {
  /**
   * Overide base init functionality and load sequelize as well as
   * commands and listeners.
   * @param {BaeBae} bot A reference to the BaeBae instance
   */
  init(bot) {
    this.commands = {
      /**
       * Checks when a user was last seen
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      seen: function (bot, nick, channel, data) {
        let client = bot.client
        let seenNick = data.trim()

        if (!seenNick) {
          client.say(channel, 'seen who?')
          return
        }

        return seenDb.SeenUser.findOne({
          where: {
            channel: channel,
            nick: seenNick
          }
        })
        .then(seenUser => {
          let output = ''
          if (seenUser) {
            switch (seenUser.action) {
              case 'join':
              case 'names':
                output = `${seenUser.nick} is in the channel right now`
                break
              default:
                output = `I last saw ${seenNick} on ${seenUser.lastSeen}`
            }
          } else {
            output = `I've not seen anyone by that name`
          }

          client.say(channel, output)
        })
      }
    }

    this.listeners = {
      /**
       * This event happens right after joining and you can trigger it yourself
       * @param {string} channel The channel where it was triggered
       * @param {Array} nicks An array of the nicks in the specified channel
       * @return {Array} An array of promise objects for adding/updating user records
       */
      'names': function (channel, nicks) {
        console.info('event names')
        let promises =  []
        for (let nick in nicks) {
          promises.push(buildSeenUser(channel, nick, 'names'))
        }

        return Promise.all(promises)
      },

      /**
       * Join event. This happens when a user connects to a channel
       * @param {string} channel The channel where it was triggered
       * @param {string} nick The user who joined channel
       * @param {string} message The join message, if any
       * @return {Promise} The promise object of adding/updating the user record
       */
      'join': function (channel, nick, message) {
        console.info('event join')
        return buildSeenUser(channel, nick, 'join')
      },

      /**
       * This happens when a user leaves a channel
       * @param {string} channel The channel where it was triggered
       * @param {string} nick The user who left channel
       * @param {string} message The parting message, if any
       * @return {Promise} The promise object of adding/updating the user record
       */
      'part': function (channel, nick, reason, message) {
        console.info('event part')
        return buildSeenUser(channel, nick, 'part')
      },

      /**
       * This happens when a user quits IRC
       * @param {string} nick The user who quit IRC
       * @param {string} reason The reason user quit
       * @param {Array} channels The channels user left when quitting
       * @param {string} message The quitting message, if any
       * @return {Array} An array of promise objects for adding/updating user records
       */
      'quit': function (nick, reason, channels, message) {
        console.info('event quit')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (channels.indexOf(botChannels[i]) !== -1) {
            promises.push(buildSeenUser(botChannels[i], nick, 'quit'))
          }
        }

        return Promise.all(promises)
      },

      /**
       * This happens when a user is kicked from a channel
       * @param {string} channel The channel where it was triggered
       * @param {string} nick The user who was kicked from channel
       * @param {string} by The user who initiated the kicking command
       * @param {string} reason The reason user was kicked, if any
       * @param {string} message The kicking message, if any
       * @return {Promise} The promise object of adding/updating the user record
       */
      'kick': function (channel, nick, by, reason, message) {
        console.info('event kick')
        return buildSeenUser(channel, nick, 'kick')
      },

      /**
       * This happens when a user is sent the kill message by an IRC operator
       * @param {string} nick The user who was sent the kill message
       * @param {string} reason The reason user was sent kill message
       * @param {Array} channels The channels user will part from when going offline
       * @param {string} message The killing message, if any
       * @return {Array} An array of promise objects for adding/updating user records
       */
      'kill': function (nick, reason, channels, message) {
        console.info('event kill')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (channels.indexOf(botChannels[i]) !== -1) {
            promises.push(buildSeenUser(botChannels[i], nick, 'kill'))
          }
        }

        return Promise.all(promises)
      },

      /**
       * Happens when a user changes their nickname
       * @param {string} oldnick The former nickname
       * @param {string} newnick The new and current nickname
       * @param {Array} channels The channels the user is in
       * @param {string} message Raw details
       * @return {Array} An array of promises for adding/updating user records
       */
      'nick': function (oldnick, newnick, channels, message)  {
        console.info('event nick')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (channels.indexOf(botChannels[i]) !== -1) {
            promises.push(buildSeenUser(botChannels[i], oldnick, 'nick'))
            promises.push(buildSeenUser(botChannels[i], newnick, 'nick'))
          }
        }

        return Promise.all(promises)
      }
    }
  }
}

/**
 * Save or update the seen user in the database
 * @param {string} channel The channel where the command was triggered.
 * @param {string} nick The user who triggered the command.
 * @param {string} action The event or action last associated with the user
 * @return {Promise} The sequelize promise chain for adding/updating the user record
 */
function buildSeenUser(channel, nick, action) {
  let txn = null

  return seenDb.sequelize.transaction({
    autocommit: false
  })
  .then(t => {
    txn = t

    // get or create user record
    return seenDb.SeenUser.find({
      where: {
        channel: channel,
        nick: nick
      }
    }, {
      transaction: txn
    })
  })
  .then(foundUser => {
    if (!foundUser) {
      // create user
      return seenDb.SeenUser.create({
        channel: channel,
        nick: nick,
        lastSeen: seenDb.sequelize.fn('now'),
        action: action,
        createdOn: seenDb.sequelize.fn('now'),
      }, {
        transaction: txn
      })
    }

    // update user
    return seenDb.SeenUser.update({
      lastSeen: seenDb.sequelize.fn('now'),
      action: action
    }, {
      where: {
        seenUserId: foundUser.seenUserId
      },
      transaction: txn
    })
  })
  .then(result => {
    return txn.commit()
  })
  .catch(function (err) {
    console.error(err)
    return txn.rollback()
    .then(() => {
      throw new Error(err)
    })
  })
}

module.exports = Seen
