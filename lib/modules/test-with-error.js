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
    throw new Error('test module error - planned')
    this.commands = {

    }
  }
}

module.exports = Test
