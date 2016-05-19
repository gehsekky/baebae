/**
 * Yet another seen module
 * @module ModuleSeen
 */
'use strict'

let _            = require('lodash')
let config       = require('config')
let Sequelize    = require('sequelize')
let BaeBaeModule = require('../baebae-module')

let sequelize = null
let SeenUser = null

/**
 * A module that passively records the last time a user was seen based off of
 * irc network events.
 */
class Seen extends BaeBaeModule {
  /**
   * Initialize internal Sequelize instance and define our ORM models.
   */
  initSequelize() {
    // initialize the local sequelize object
    sequelize = new Sequelize(
      config.get('modules.seen.database'),
      config.get('modules.seen.username'),
      config.get('modules.seen.password'),
      config.get('modules.seen.opts')
    )

    // define our main user object
    SeenUser = sequelize.define('SeenUser', {
      channel: Sequelize.STRING,
      nick: Sequelize.STRING,
      lastSeen: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'last_seen'
      },
      action: Sequelize.STRING
    }, {
      underscored: true
    })

    // var SeenUserMap = this._sequelize.define('SeenUserMap', {
    //   channel: Sequelize.STRING,
    //   nick: Sequelize.STRING,
    //   aliasOf: {
    //     type: Sequelize.STRING,
    //     field: 'alias_of'
    //   }
    // }, {
    //   underscored: true
    // })

    return sequelize.sync({
      force: true
    }).then(function () {
      bot.logger.info('sequelize synced for seen') })
  }

  /**
   * Overide base init functionality and load sequelize as well as
   * commands and listeners.
   * @param {BaeBae} bot - A reference to the BaeBae instance
   */
  init(bot) {
    this.initSequelize()

    this.commands = {
      /**
       * Checks when a user was last seen
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      seen: function (bot, nick, channel, data) {
        var client = bot.client
        var seenNick = _.trim(data)

        if (!seenNick) {
          client.say(channel, 'seen who?')
          return
        }

        return SeenUser.findOne({
          where: {
            channel: channel,
            nick: seenNick
          }
        })
        .then(function (seenUser) {
          var output = ''
          if ( seenUser ) {
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
       * Names event. This happens right after joining and you can trigger it on the
       * server yourself.
       * @param {string} channel - The channel where it was triggered
       * @param {Array} nicks - An array of the nicks in the specified channel
       * @return {Array} An array of the promise sequelize objects
       */
      'names': function (channel, nicks) {
        let nick
        console.info('event names')
        let promises =  []
        for (nick in nicks) {
          promises.push(buildSeenUser(channel, nick, 'names'))
        }

        return Promise.all(promises)
      },
      'join': function (channel, nick, message) {
        console.info('event join')
        return buildSeenUser(channel, nick, 'join')
      },
      'part': function (channel, nick, reason, message) {
        console.info('event part')
        return buildSeenUser(channel, nick, 'part')
      },
      'quit': function (nick, reason, channels, message) {
        console.info('event quit')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (_.indexOf(channels, botChannels[i]) !== -1) {
            promises.push(buildSeenUser(botChannels[i], nick, 'quit'))
          }
        }

        return Promise.all(promises)
      },
      'kick': function (channel, nick, by, reason, message) {
        console.info('event kick')
        return buildSeenUser(channel, nick, 'kick')
      },
      'kill': function (nick, reason, channels, message) {
        console.info('event kill')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (_.indexOf(channels, botChannels[i]) !== -1) {
            promises.push(buildSeenUser(botChannels[i], nick, 'kill'))
          }
        }

        return Promise.all(promises)
      },
      /**
       * Nick event. Happens when a user changes their nickname.
       * @param {string} oldnick - The former nickname
       * @param {string} newnick - The new and current nickname
       * @param {Array} channels - The channels the user is in
       * @param {string} message - Raw details
       * @return {Array} - An array of sequelize promise chains
       */
      'nick': function (oldnick, newnick, channels, message)  {
        console.info('event nick')
        let botChannels = config.get('options.channels')
        let promises = []
        for (let i = 0, len = botChannels.length; i < len; i++) {
          if (_.indexOf(channels, botChannels[i]) !== -1) {
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
 * @param {string} channel - The channel where the command was triggered.
 * @param {string} nick - The user who triggered the command.
 * @param {action} action - The event or action last associated with the user
 * @return {Promise} The sequelize promise chain
 */
function buildSeenUser(channel, nick, action) {
  // get or create user record
  return SeenUser.findOrCreate({
    where: {
      channel: channel,
      nick: nick
    },
    defaults: {
      action: action
    }
  })
  .spread(function (instance, created) {
    // if gotten, update lastseen
    if (created) {
      return
    }

    return instance.updateAttributes({
      lastSeen: sequelize.fn('now'),
      action: action
    })
    instance.save()
  })
  .catch(function (err) {
    console.error(err)
    throw new Error(err)
  })
}

module.exports = Seen
