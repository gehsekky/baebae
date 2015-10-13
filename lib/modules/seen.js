/**
 * yet another seen module
 * @module ModuleSeen
 */
'use strict'

var config    = require('config')
var Sequelize = require('sequelize')
var _         = require('lodash')

var SeenUser = null

/**
 * @constructor
 */
function ModuleSeen() {
  /**
   * @namespace
   */
  this.commands = {
    /**
     * check when user last seen
     * @param {object} bot a reference to the bot
     * @param {string} nick the nick of user who gave command
     * @param {string} channel the channel command was given in
     * @param {data} anything after the command
     */
    seen: function ( bot, nick, channel, data ) {
      var client = bot.getClient()
      var seenNick = _.trim(data)

      if ( !seenNick ) {
        client.say(channel, 'seen who?')
        return
      }

      SeenUser
        .findOne({
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
                output = seenUser.nick + ' is in the channel right now'
                break
              default:
                output = 'I last saw ' + seenNick + ' on ' + seenUser.lastSeen
            }
          } else {
            output = 'I\'ve not seen anyone by that name'
          }
          client.say(channel, output)
        })
    }
  }

  this._sequelize = new Sequelize(
    config.get('modules.seen.database'),
    config.get('modules.seen.username'),
    config.get('modules.seen.password'),
    {
      host: config.get('modules.seen.host'),
      dialect: config.get('modules.seen.dbtype')
    }
  )
}

/**
 * required module initialize function
 * @param {object} bot a reference to the bot instance
 */
ModuleSeen.prototype.initialize = function ( bot ) {
  var that = this
  var client = bot.getClient()

  SeenUser = this._sequelize.define('SeenUser', {
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

  this._sequelize.sync({
    force: true
  }).then(function () {
    console.log('sequelize synced for seen')
  })

  // event names
  client.addListener('names', function ( channel, nicks ) {
    var nick
    console.log('event names')
    for (nick in nicks) {
      buildSeenUser(channel, nick, that, SeenUser, 'names')
    }
  })

  // event join
  client.addListener('join', function ( channel, nick, message ) {
    console.log('event join')
    buildSeenUser(channel, nick, that, SeenUser, 'join')
  })

  // event part
  client.addListener('part', function ( channel, nick, reason, message ) {
    console.log('event part')
    buildSeenUser(channel, nick, that, SeenUser, 'part')
  })

  // event quit
  client.addListener('quit', function ( nick, reason, channels, message ) {
    console.log('event quit')
    var botChannels = config.get('options.channels')
    for (var i = 0, len = botChannels.length; i < len; i++) {
      if (_.indexOf(channels, botChannels[i]) !== -1) {
        buildSeenUser(channel, nick, that, SeenUser, 'quit')
      }
    }
  })

  // event kick
  client.addListener('kick', function ( channel, nick, by, reason, message ) {
    console.log('event kick')
    buildSeenUser(channel, nick, that, SeenUser, 'kick')
  })

  // event kill
  client.addListener('kill', function ( nick, reason, channels, message ) {
    console.log('event kill')
    var botChannels = config.get('options.channels')
    for (var i = 0, len = botChannels.length; i < len; i++) {
      if (_.indexOf(channels, botChannels[i]) !== -1) {
        buildSeenUser(channel, nick, that, SeenUser, 'kill')
      }
    }
  })

  client.addListener('nick', function ( oldnick, newnick, channels, message )  {
    console.log('event nick')
    var botChannels = config.get('options.channels')
    for (var i = 0, len = botChannels.length; i < len; i++) {
      if (_.indexOf(channels, botChannels[i]) !== -1) {
        buildSeenUser(channel, oldnick, that, SeenUser, 'nick')
        buildSeenUser(channel, newnick, that, SeenUser, 'nick')
      }
    }
  })
}

function buildSeenUser( channel, nick, that, SeenUser, action ) {
  SeenUser
    // get or create user record
    .findOrCreate({
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
      if (!created) {
        instance.updateAttributes({
          lastSeen: that._sequelize.fn('now'),
          action: action
        })
        instance.save()
      }
    })
    .catch(function (err) {
      console.log('error', err)
    })
}

module.exports = ModuleSeen
