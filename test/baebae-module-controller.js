/* jshint expr: true */
'use strict'

let mocha         = require('mocha')
let chai          = require ('chai')
let assert        = chai.assert
let expect        = chai.expect
let BaeBae        = require('baebae')
let ModController = require('baebae-module-controller')

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