/**
 * Controller object for BaeBae modules
 * @module BaeBaeModuleController
 */
'use strict'

let _            = require('lodash')
let config       = require('config')
let path         = require('path')
let BaeBaeModule = require('./baebae-module')

/**
 * Manages the modules for the bot
 */
class BaeBaeModuleController {
  /**
   * @constructor
   */
  constructor(bot) {
    // reference to bot instance
    this.bot = bot

    // internal tracking variables
    this.numMods = 0
    this.numModsLoaded = 0
  }

  /**
   * Load the bot modules into memory
   */
  loadModules() {
    // get list of enabled modules
    let enabledMods = config.get('enabled-modules')

    // reset bot commands
    this.bot.commands = {}

    // reset tracking vars
    this.numMods = 0
    this.numModsLoaded = 0

    // iterate over each module and load it
    for (let i = 0, lim = enabledMods.length; i < lim; i++) {
      let modConfig = enabledMods[i]

      try {
        let ModuleDefinition = require('./modules/' + modConfig)
        let mod = new ModuleDefinition()
        mod.init(this.bot)

        // absorb mod commands into bot command collection
        _.assign(this.bot.commands, mod.commands)

        // iterate over mod listeners and initialize the bindings
        for (let listener in mod.listeners) {
          this.bot.client.addListener(listener, mod.listeners[listener])
        }

        this.numModsLoaded++
      } catch (err) {
        console.error(`problem loading module ${modConfig}: ${err}`)
      } finally {
        this.numMods++;
      }
    }
    console.info(`${this.numModsLoaded} mods loaded out of ${this.numMods}`)
  }
}

module.exports = BaeBaeModuleController
