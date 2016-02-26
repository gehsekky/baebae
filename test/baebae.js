'use strict'

var chai = require('chai')
var assert = chai.assert
var BaeBae = require('../lib/baebae')

describe('BaeBae test suite', function () {
  describe('constructor tests', function () {
    it('should not throw an error with no params', function () {
      assert.doesNotThrow(function () {
        var baebae = new BaeBae()
      })
    })

    it('should have a null client before being initialized', function () {
      var baebae = new BaeBae()
      assert(baebae.client === null, 'client should be null')
    })
  })

  describe('initialize tests', function () {
    
  })
})
