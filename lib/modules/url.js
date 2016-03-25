/**
 * A module to announce url titles
 * @module ModuleUrl
 */

'use strict'

let cheerio      = require('cheerio')
let request      = require('request')
let url          = require('url')
let BaeBaeModule = require('../baebae-module')

/**
 * A regex for detecting urls
 * @link https://gist.github.com/dperini/729294
 * @type {RegExp}
 */
let urlRegex = new RegExp(
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

/**
 * This module performs basic url announce functionality for a channel
 */
class Url extends BaeBaeModule {
  /**
   * required module initialize function
   * @param {BaeBae} bot - A reference to the bot instance
   */
  init(bot) {
    this.listeners = {
      'message#': function (nick, to, text, message) {
        let match = urlRegex.exec(text),
            promises = []

        // this mod supports multiple links in a message
        while (match) {
          // extract link and fetch
          printLink(match, nick, promises, bot, to)

          match = urlRegex.exec(text)
        }

        return Promise.all(promises)
      }
    }
  }
}

/**
 * Gets the link from the regex match and fetches the title
 * to print it in the channel
 */
function printLink(match, nick, promises, bot, to) {
  let urlToRetrieve = match[0]
  console.info(`url in chat from ${nick}: ${urlToRetrieve}`)
  promises.push(
    getUrl(urlToRetrieve)
    .then(html => {
      let $, title, output, parsedUrl

      if (html) {
        // extract title
        $ = cheerio.load(html)
        title = $('title').text().trim() || 'No title detected'

        // output title and host
        parsedUrl = url.parse(urlToRetrieve)
        output = `[${title}] - ${parsedUrl.host}`
        bot.client.say(to, output)
      }
    })
    .catch(console.error)
  )
}

/**
 * Performs an http get for url
 * @param {string} urlToRetrieve - The url to retrieve
 * @return {Promise} A promise that resolves to an http response
 */
function getUrl(urlToRetrieve) {
  return new Promise(function (resolve, reject) {
    let options = {
      url: urlToRetrieve,
      method: 'get'
    }

    request(options, function (err, res, body) {
      switch (res.statusCode) {
        case 200:
        case 201:
        case 202:
        case 203:
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

module.exports = Url
