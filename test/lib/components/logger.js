const chai = require('chai')
const logger = require('../../../lib/components/logger')
const expect = chai.expect

describe('logger test suite', () => {
  it('should not be null', () => {
    expect(logger).to.not.be.null
  })
})
