/* jshint expr: true */
'use strict'

let chai         = require ('chai')
let assert       = chai.assert
let expect       = chai.expect
let BaeBaeModule = require('../../lib/baebae-module')

describe('BaeBaeModule test suite', () => {
  let module = null
  describe('constructor tests', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        module = new BaeBaeModule()
      })
    })

    it('should not be null', () => {
      expect(module).to.not.be.null
    })
  })

  describe('init tests', () => {
    let module = new BaeBaeModule()
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        module.init()
      })
    })
  })
})