/* jshint expr: true */
'use strict'

let config        = require('config')
let chai          = require('chai')
let assert        = chai.assert
let expect        = chai.expect
let BaeBae        = require('../../lib/baebae')
let ModController = require('../../lib/baebae-module-controller')

describe('BaeBaeModuleController test suite', () => {
  let modController = null

  it('should be able to instantiate', () => {
    assert.doesNotThrow(() => {
      modController = new ModController({
        client: {
          addListener: function () {}
        },
        logger: {
          info: function (data) {
            console.log(data)
          },
          error: function (err) {
            console.error(err.stack)
          }
        }
      })
    })

    expect(modController.mods).to.be.empty
    expect(modController.numMods).to.be.equal(0)
  })

  it('should be able to load modules', () => {
    assert.doesNotThrow(() => {
      modController.loadModules()
    })

    expect(modController.numMods).to.be.equal(config.get('enabled-modules').length)
  })

  it('should be able to get module by command', () => {
    let mod = modController.getModuleWithCommand('test')
    expect(mod).to.be.null

    mod = modController.getModuleWithCommand('uptime')
    expect(mod).to.not.be.null
  })

  it('should be able to answer if it has a command', () => {
    expect(modController.hasCommand('test')).to.be.false
    expect(modController.hasCommand('uptime')).to.be.true
  })

  it('should be able to run commands', () => {
    assert.throws(() => {
      modController.runCommand('test')
    }, 'could not find module with command: test')

    assert.doesNotThrow(() => {
      modController.runCommand('uptime')
    })
  })
})