/**
 * Module to display the bot version
 */
'use strict'

const BaeBaeModule = require('../baebae-module')
const packageJson = require('../../package.json')

/**
 * This module retrieves and displays weather details for given locations
 */
class Version extends BaeBaeModule {
  // default constructor
  constructor() {
    super()
  }

  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init(bot) { // eslint-disable-line no-unused-vars
    this.commands = {
      /**
       * Displays bot version to channel
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      version: (bot, nick, channel, data) => { // eslint-disable-line no-unused-vars
        bot.client.say(channel, `version is v${packageJson.version}`)
      }
    }
  }
}

module.exports = Version
