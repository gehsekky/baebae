/* jshint expr: true */
'use strict'

let chai          = require ('chai')
let assert        = chai.assert
let expect        = chai.expect
let BaeBae        = require('../../lib/baebae')
let ModController = require('../../lib/baebae-module-controller')

describe('BaeBaeModuleController test suite', () => {
  describe('constructor tests', () => {
    let modController = null

    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        modController = new ModController({
          bot: {
            client: {
              addListener: function () {
                
              }
            }
          }
        })
      })
    })
  })
})