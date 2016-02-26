/**
 * A module for storing irc quotes
 */
'use strict'

let BaeBaeModule = require('baebae-module')

/**
 * This module allows the saving of user quotes for later
 * recall. Supports random quote and fetching by ID.
 */
class Quote extends BaeBaeModule {
  init() {
    this.commands = {
      /**
       * Main quote command
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      quote: function (bot, nick, channel, data) {

      }
    }
  }
}

module.exports = Quote
