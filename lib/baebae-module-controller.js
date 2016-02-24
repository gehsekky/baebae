'use strict'

let config       = require('config')
let path         = require('path')
let BaeBaeModule = require('baebae-module')

class BaeBaeModuleController {
  constructor(bot) {
    // reference to bot instance
    this.bot = bot

    // internal tracking variables
    this.numMods = 0
    this.numModsLoaded = 0
  }

  loadModules() {
    // get configuration objects for modules
    let modConfigs = config.get('modules')

    // reset bot commands
    this.bot.commands = {}

    // reset tracking vars
    this.numMods = 0
    this.numModsLoaded = 0

    // iterate over each module and load it
    for (let modConfig in modConfigs) {
      try {
        let ModuleDefinition = require(path.join('./modules/' + modConfig))
        let mod = new ModuleDefinition()
        mod.loadCommands(this.bot)
        mod.init(this.bot)

        this.numModsLoaded++
      } catch ( err ) {
        console.error(`problem loading module ${modConfig}: ${err}`)
      } finally {
        this.numMods++;
      }
    }
    console.info(`${this.numModsLoaded} mods loaded out of ${this.numMods}`)
  }
}

module.exports = BaeBaeModuleController
