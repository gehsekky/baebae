/**
 * A sample module for testing purposes
 */
'use strict'

let BaeBaeModule = require('../baebae-module')

/**
 * This module is mostly just for testing
 */
class Test extends BaeBaeModule {
  init() {
    this.commands = {

    }

    this.listeners = {
      'test': function () {
        
      }
    }
  }
}

module.exports = Test
