const chai = require('chai')
const commonRegexes = require('../../../lib/components/common-regexes')

const expect = chai.expect

describe('common regexes test suite', () => {
  describe('url regex', () => {
    it('should detect a normal url as valid', () => {
      const urlRegex = new RegExp(commonRegexes.Url, 'ig')
      expect(urlRegex.test('http://www.exampleurl.com')).to.be.true
    })

    it('should detect garbage text as an invalid url', () => {
      const urlRegex = new RegExp(commonRegexes.Url, 'ig')
      expect(urlRegex.test('asdkfjl asjdflkjoiaoe23kfmnqk')).to.be.false
    })
  })
})
