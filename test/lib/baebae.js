/* jshint expr: true */
'use strict'

let chai   = require('chai')
let assert = chai.assert
let expect = chai.expect
let BaeBae = require('../../lib/baebae')

describe('BaeBae test suite', () => {
  let baebae = null

  it('should be able to instantiate', () => {
    assert.doesNotThrow(() => {
      baebae = new BaeBae()
    })

    expect(baebae).to.not.be.null
  })

  it('should set logger', () => {
    let logger = {
      info: function (data) {
        console.log(data)
      },
      error: function (err) {
        console.error(err)
      },
      testMessage: 'verified'
    }
    assert.doesNotThrow(() => {
      baebae.setLogger(logger)
    })

    expect(baebae.logger.testMessage).to.be.equal('verified')
  })

  it('should initialize', (done) => {
    assert.doesNotThrow(() => {
      baebae.initialize()
      done()
    })
  })
})
