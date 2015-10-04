'use strict'

module.exports = {
  load: function ( moduleName ) {
    var mod = require('./' + moduleName)
    mod.initialize( this )
  }
}
