/**
 * An simple IRC bot
 * @module BaeBae
 * @author gehsekky
 */

'use strict'

var config       = require('config')
var irc          = require('irc')
var BaeBaeModule = require('./modules/baebae-module')

/**
 * @class
 * @constructor
 */
function BaeBae() {
  this._client = null
  this._commands = null
}

/**
 * starts the bot engine
 */
BaeBae.prototype.initialize = function () {
  var modConfig, modConfigs, numMods, numModsLoaded, that
  console.log('initializing BaeBae')

  that = this

  // the core of baebae
  this._client = new irc.Client(
    config.get('host'),
    config.get('botnick'),
    config.get('options')
  )

  this._commands = {}

  // load modules
  numMods = 0
  numModsLoaded = 0
  modConfigs = config.get('modules')
  for (modConfig in modConfigs) {
    try {
      BaeBaeModule.load.call(this, modConfig)
      numModsLoaded++
    } catch ( err ) {
      console.log('error loading module ' + modConfig + ': ' + err)
    } finally {
      numMods++;
    }
  }
  console.log(numModsLoaded + ' mods loaded out of ' + numMods)

  // setup command listener
  this._client.addListener('message#', function ( nick, to, text, message ) {
    var match
    if (text && text[0] === config.get('command-prefix')) {
      match = /^\.(\w+)\s*(.*?)$/.exec(text)
      if (match) {
        if (that._commands[match[1]]) {
          try {
            that._commands[match[1]](that, nick, to, match[2])
            console.log('command run', match[1])
          } catch (err) {
            console.log('command error', err)
          }
        }
      }
    }
  })

  // bind errors
  this._client.addListener('error', function (msg) {
    switch (msg.command) {
      case 'err_chanoprivsneeded':
        console.log('err_chanoprivsneeded detected')
        that.getClient().say(msg.args[1], 'I do not have ops')
        break
      default:
        ;
    }
    console.error('error', msg)
  })
}

/**
 * a getter for the irc lib client
 * @return {object} an irc.Client object
 */
BaeBae.prototype.getClient = function () {
  return this._client
}

module.exports = BaeBae
