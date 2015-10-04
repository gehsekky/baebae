'use strict'

var config       = require('config')
var irc          = require('irc')
var BaeBaeModule = require('./modules/baebae-module')

function BaeBae() {
  this._client = null
}

BaeBae.prototype.initialize = function () {
  var modConfig, modConfigs, mod, numMods, numModsLoaded
  console.log('initializing BaeBae')

  // the core of baebae
  this._client = new irc.Client(
    config.get('host'),
    config.get('botnick'),
    config.get('options')
  )

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
}

BaeBae.prototype.getClient = function () {
  return this._client
}

module.exports = BaeBae
