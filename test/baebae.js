/* jshint expr: true */
'use strict'

let config = require('config')
let chai   = require('chai')
let assert = chai.assert
let expect = chai.expect
let net    = require('net')
let BaeBae = require('../lib/baebae')

describe('BaeBae test suite', () => {
  let baebae = null
  let server = null
  
  before(() => {
    // set up mock irc server
    server = net.createServer(sock => {
      sock.on('data', data => {
        console.log('data', data.toString('utf8'))
        if (data.toString('utf8') == 'PRIVMSG #test :test message') {
          console.log('test message received on server')
        }
      })
    })
    .listen(config.get('options.port'), config.get('host'))
  })

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

  describe('initialize tests', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        baebae.initialize()
      })
    })
  })

  describe('command listener tests', () => {
    it('should process the message', () => {
      assert.doesNotThrow(() => {
        baebae.client.say('#test', 'test message')
      })
    })
  })

  after(() => {
    server.close()
  })
})
