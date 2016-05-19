/* jshint expr: true */
'use strict'

let chai   = require('chai')
let assert = chai.assert
let expect = chai.expect
let BaeBae = require('../../lib/baebae')

describe('BaeBae test suite', () => {
  let baebae = null

  describe('constructor tests', () => {
    it('should not throw an error with no params', () => {
      assert.doesNotThrow(() => {
        baebae = new BaeBae()
      })
    })

    it('should not be null', () => {
      expect(baebae).to.not.be.null
    })
  })
})
