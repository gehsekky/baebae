/**
 * a silly module for printing butts
 * @module ModuleButts
 */

'use strict'

let _            = require('lodash')
let BaeBaeModule = require('baebae-module')

/**
 * @class
 * @constructor
 */
class Butts extends BaeBaeModule {
  constructor() {
    this.commands = {
      /**
       * print butts
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      butts: function (bot, nick, channel, data) {
        let randomNum = _.random(1, 100),
            output = ''

        console.log('randomNum for butts', randomNum)

        if ( randomNum === 100 ) {
          output = '))<>(('
        } else if ( randomNum % 2 === 0 ) {
          output = '))'
        } else {
          output = '(('
        }

        bot.client.say(channel, output)
      }
    }
  }
}

module.exports = Butts
