/**
 * A module to announce url titles
 */
'use strict'

const url           = require('url')
const cheerio       = require('cheerio')
const BaeBaeModule  = require('../baebae-module')
const commonRegexes = require('../components/common-regexes')
const request       = require('../components/promise-request')
const logger        = require('../components/logger')

const urlRegex = new RegExp(commonRegexes.Url, 'ig')

/**
 * This module performs basic url announce functionality for a channel
 */
class Url extends BaeBaeModule {
  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init(bot) {
    this.listeners = {
      /**
       * Bind to the message# event to parse every message coming into channel
       * @param {string} nick The user saying the message
       * @param {string} to The channel user said message in
       * @param {string} text The content of user message
       * @param {string} message Any client-appended message to user message
       * @return {Array} An array of promises for making http requests to links
       *   contained in channel message
       */
      'message#': function (nick, to, text, message) { // eslint-disable-line no-unused-vars
        const promises = []
        let match = urlRegex.exec(text)

        // this mod supports multiple links in a message
        while (match) {
          // extract link and fetch
          promises.push(printLink(bot, match, nick, to))

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
 * @param {Object} bot A reference to the bot instance
 * @param {Array} match A match result from a regex operation
 * @param {string} nick The user who posted link in channel
 * @param {string} to The channel to send the result to 
 */
function printLink(bot, match, nick, to) {
  const urlToRetrieve = match[0]

  logger.info(`url in chat from ${nick}: ${urlToRetrieve}`)

  return getUrl(urlToRetrieve, bot)
  .then(html => {
    // if there's no html, just log it and move on
    if (!html) {
      logger.info(`no html returned for link: ${urlToRetrieve}`)
      return
    }

    // extract title
    const $ = cheerio.load(html)
    const title = $('title').first().text().trim().replace('\n', '') || 'No title detected'

    // output title and host
    const parsedUrl = url.parse(urlToRetrieve)
    const output = `[${title}] - ${parsedUrl.host}`
    bot.client.say(to, output)
  })
  .catch(logger.error)
}

/**
 * Performs an http get for url
 * @param {string} urlToRetrieve The url to retrieve
 * @param {Object} bot A reference to the bot instance
 * @return {Promise} A promise that resolves to an http response
 */
function getUrl(urlToRetrieve, bot) {
  return request({
    url: urlToRetrieve,
    method: 'get'
  })
  .then(result => {
    if (!result) {
      return ''
    }

    switch (result.status.code) {
      case 200:
      case 201:
      case 202:
      case 203:
        // ignore images
        if (result.response.headers['content-type'].indexOf('image') !== 0) {
          return result.entity
        } else {
          logger.info('ignoring image')
          return ''
        }
      default:
        logger.error(result.entity)
    }
  })
  .catch(err => {
    logger.error(err)
  })
}

module.exports = Url
