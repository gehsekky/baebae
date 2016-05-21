let chai   = require('chai')
let expect = chai.expect
let moment = require('moment')
let Uptime = require('../../../lib/modules/uptime.js')

describe('uptime module test suite', () => {
  let uptime = new Uptime()

  it('should give difference in second', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-01 12:00:01'))
    expect(diffText).to.equal('1 second')
  })

  it('should give difference in seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-01 12:00:36'))
    expect(diffText).to.equal('36 seconds')
  })

  it('should give difference in minute and seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-01 12:01:36'))
    expect(diffText).to.equal('1 minute and 36 seconds')
  })

  it('should give difference in minutes and seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-01 12:37:36'))
    expect(diffText).to.equal('37 minutes and 36 seconds')
  })

  it('should give difference in hours, minutes, and seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-01 15:01:36'))
    expect(diffText).to.equal('3 hours, 1 minute, and 36 seconds')
  })

  it('should give difference in days, hours, minutes, and seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2016-01-13 15:01:36'))
    expect(diffText).to.equal('12 days, 3 hours, 1 minute, and 36 seconds')
  })

  it('should give difference in years, days, hours, minutes, and seconds', () => {
    let diffText = uptime.humanizeTimeDiff(moment('2016-01-01 12:00:00'), moment('2018-01-13 15:01:36'))
    expect(diffText).to.equal('2 years, 12 days, 3 hours, 1 minute, and 36 seconds')
  })
})