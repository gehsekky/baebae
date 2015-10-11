/**
 * a static utility class for modules stuff
 * @module BaeBaeModule
 */

'use strict'

var _ = require('lodash')

/**
 * @namespace
 */
var BaeBaeModule = {
  /**
   * loads modules by name
   * @param {string} moduleName the name of the module to load
   */
  load: function ( moduleName ) {
    // initialize mod
    var modDef = require('./' + moduleName)
    var mod = new modDef()
    mod.initialize( this )

    // absorb mod commands
    if ( mod['commands'] ) {
      this._commands = _.assign({}, this._commands, mod.commands)
    }
  }
}

module.exports = BaeBaeModule
