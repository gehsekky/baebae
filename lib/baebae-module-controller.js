/**
 * Controller object for BaeBae modules
 */
'use strict'

const config = require('config')

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
    this.mods = []
  }

  /**
   * Load the bot modules into memory
   */
  loadModules() {
    // get list of enabled modules
    const enabledModNames = config.get('enabled-modules')

    // reset tracking vars
    this.numMods = 0
    this.mods = []

    // iterate over each module and load it
    enabledModNames.forEach(modName => {
      try {
        const ModuleDefinition = require('./modules/' + modName)
        const mod = new ModuleDefinition()
        mod.init(this.bot)

        // iterate over mod listeners and initialize the bindings
        for (let listener in mod.listeners) {
          this.bot.client.addListener(listener, mod.listeners[listener].bind(this.bot))
        }

        this.mods.push(mod)
      } catch (err) {
        this.bot.logger.error(`problem loading module ${modName}: ${err}`)
      } finally {
        this.numMods++;
      }
    })

    this.bot.logger.info(`${this.mods.length} mods loaded out of ${this.numMods}`)
  }

  /**
   * Finds the module with the associated trigger command
   * @param {string} command The trigger command to search for
   * @return {object} The module containing the trigger or null
   */
  getModuleWithCommand(command) {
    for (let i = 0, lim = this.mods.length; i < lim; i++) {
      if (this.mods[i].commands[command]) {
        return this.mods[i]
      }
    }

    return null
  }

  /**
   * Check to see if the Module Controller has a module with the given command
   * @param {string} command The command to search for
   * @return {bool} Whether or not we have this command
   */
  hasCommand(command) {
    return !!this.getModuleWithCommand(command)
  }

  /**
   * Executes whatever the trigger command is associated with
   * @param {string} command The trigger command to execute
   * @param {string} nick The user who initiated the command
   * @param {string} to The channel to place output
   * @param {string} args Whatever came after the command in chat
   */
  runCommand(command, nick, to, args) {
    const mod = this.getModuleWithCommand(command)

    if (!mod) {
      throw new Error(`could not find module with command: ${command}`)
    }

    try {
      mod.commands[command](this.bot, nick, to, args)
      this.bot.logger.info(`command processed: ${command}`)
    } catch (err) {
      this.bot.logger.error('command error', err)
    }
  }
}

module.exports = BaeBaeModuleController
