const chai = require('chai')
const nock = require('nock')
const promiseRequest = require('../../../lib/components/promise-request')

const expect = chai.expect

describe('promise-request test suite', () => {
  before(() => {
    nock('http://localhost')
    .get('/')
    .reply(200, {
      message: 'OK'
    })

    nock('http://localhost')
    .get('/error')
    .replyWithError({
      message: 'FAIL'
    })
  })

  after(() => {
    nock.cleanAll()
  })

  it('should return a promise', done => {
    const req = promiseRequest('http://localhost/')
    expect(Promise.resolve(req) === req).to.be.true
    done()
  })

  it('should fail', () => {
    return promiseRequest('http://localhost/error')
    .catch(response => {
      expect(response.message).to.equal('FAIL')
    })
  })
})
