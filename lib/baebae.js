/**
 * A simple nodejs IRC bot
 */
'use strict'

const config                 = require('config')
const irc                    = require('irc')
const BaeBaeModuleController = require('./baebae-module-controller')
const logger                 = require('./components/logger')

/**
 * The main bot class. Mostly a wrapper around the irc lib, but it
 * offers a lot of flexibility with the support for modules.
 */
class BaeBae {
  /**
   * @constructor
   */
  constructor() {
    this.client = null
    this.modController = null
  }

  /**
   * Starts the bot engine essentially. We load the irc lib client
   * and bot modules. Then we set up a hook for commands in chat.
   */
  initialize() {
    logger.info('initializing BaeBae')

    // initialize module controller
    this.modController = new BaeBaeModuleController(this)

    // load irc client
    this.client = new irc.Client(
      config.get('host'),
      config.get('botnick'),
      config.get('options')
    )

    // load modules
    this.modController.loadModules()

    // setup command listener
    this.client.addListener('message#', (nick, to, text, message) => { // eslint-disable-line no-unused-vars
      let match = null
      if (text && text[0] === config.get('command-prefix')) {
        match = /^\.(\w+)\s*(.*?)$/.exec(text)
        if (match) {
          if (this.modController.hasCommand(match[1])) {
            this.modController.runCommand(match[1], nick, to, match[2])
          }
        }
      }
    })

    // bind error event
    this.client.addListener('error', msg => {
      switch (msg.command) {
        case 'err_chanoprivsneeded':
          logger.info('err_chanoprivsneeded detected')
          this.client.say(msg.args[1], 'I do not have ops')
          break
        default:
          // no op
      }

      logger.error(msg)
    })
  }
}

module.exports = BaeBae
