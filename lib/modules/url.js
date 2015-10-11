/**
 * a module to announce url titles
 * @module ModuleUrl
 */

'use strict'

var cheerio = require('cheerio')
var request = require('request')
var url     = require('url')

/**
 * @class
 * @constructor
 */
function ModuleUrl() {
  /**
   * a regex for detecting urls
   * @link https://gist.github.com/dperini/729294
   * @type {RegExp}
   */
  this._urlRegex = new RegExp(
    // protocol identifier
    "(?:(?:https?|ftp)://)" +
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +
      // host name
      "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
      // domain name
      "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
      // TLD identifier
      "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
      // TLD may end with dot
      "\\.?" +
    ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:[/?#]\\S*)?",
    "ig"
  )
}

/**
 * perform an http get for url
 * @param {string} urlToRetrieve the url to retrieve
 * @return {Promise} a promise that resolves to an http response
 */
ModuleUrl.prototype.getUrl = function ( urlToRetrieve ) {
  return new Promise(function ( resolve, reject ) {
    var options, req
    options = {
      url: urlToRetrieve,
      method: 'get'
    }
    request(options, function ( err, res, body ) {
      switch ( res.statusCode ) {
        case 200:
          // ignore images
          if (res.headers['content-type'].indexOf('image') !== 0) {
            resolve(body)
          } else {
            console.log('ignoring image')
            resolve('')
          }
          break
        default:
          reject(body)
      }
    })
  })
}

/**
 * required module initialize function
 * @param {object} bot a reference to the bot instance
 */
ModuleUrl.prototype.initialize = function ( bot ) {
  var that = this
  var client = bot.getClient()
  client.addListener('message#', function ( nick, to, text, message ) {
    var match, urlToRetrieve
    match = that._urlRegex.exec(text)
    while ( match ) {
      urlToRetrieve = match[0]
      ModuleUrl.prototype.getUrl(urlToRetrieve)
      .then(function ( html ) {
        var $, title, output, parsedUrl

        if ( html ) {
          // extract title
          $ = cheerio.load(html)
          title = $('title').text().trim() || 'No title detected'

          // output title and host
          parsedUrl = url.parse(urlToRetrieve)
          output = '[ ' + title + ' ] - ' + parsedUrl.host
          client.say(to, output)
        }
      }, function ( err ) {
        console.log('error while getting title', err)
      })
      match = that._urlRegex.exec(text)
    }
  })
}

module.exports = ModuleUrl
