/**
 * A simple IRC bot
 * @module BaeBae
 * @author gehsekky
 */

'use strict'

let config                 = require('config')
let irc                    = require('irc')
let BaeBaeModuleController = require('./baebae-module-controller')

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
    this.commands = null
    this.modController = null
  }

  /**
   * Starts the bot engine essentially. We load the irc lib client
   * and bot modules. Then we set up a hook for commands in chat.
   */
  initialize() {
    console.info('initializing BaeBae')

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
    this.client.addListener('message#', (nick, to, text, message) => {
      let match
      if (text && text[0] === config.get('command-prefix')) {
        match = /^\.(\w+)\s*(.*?)$/.exec(text)
        if (match) {
          if (this.commands[match[1]]) {
            try {
              this.commands[match[1]](this, nick, to, match[2])
              console.log('command run', match[1])
            } catch (err) {
              console.log('command error', err)
            }
          }
        }
      }
    })

    // bind error event
    this.client.addListener('error', msg => {
      switch (msg.command) {
        case 'err_chanoprivsneeded':
          console.log('err_chanoprivsneeded detected')
          this.client.say(msg.args[1], 'I do not have ops')
          break
        default:
          // no op
      }
      console.error('error', msg)
    })
  }
}

module.exports = BaeBae
