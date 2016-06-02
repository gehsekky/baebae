'use strict'

const cheerio      = require('cheerio')
const config       = require('config')
const rawjs        = require('raw.js')
const BaeBaeModule = require('../baebae-module')
const regex        = require('../components/regex')
const request      = require('../components/request')

const urlRegex = new RegExp(regex.Url, 'ig')

class RedditLinkLog extends BaeBaeModule {
  constructor() {
    super()
    this.reddit = null
    this.accessToken = null
    this.expiresIn = null
  }

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
      'message#': function (nick, to, text, message) {
        const promises = []
        let match = urlRegex.exec(text)

        // this mod supports multiple links in a message
        while (match) {
          // extract link and fetch
          promises.push(submitLink(bot, match, nick, to))

          match = urlRegex.exec(text)
        }

        return Promise.all(promises)
      }
    }
  }
}

function submitLink(bot, match, nick, to) {
  // set up the reddit client
  const reddit = new rawjs('reddit-link-log/0.1 by gehsekky')
  reddit.setupOAuth2(config.get('modules.reddit-link-log.clientId'), config.get('modules.reddit-link-log.appSecret'))
  reddit.auth({
    username: config.get('modules.reddit-link-log.username'),
    password: config.get('modules.reddit-link-log.password')
  }, (err, response) => {
    if (err) {
      bot.logger.error(err.stack)
      return Promise.resolve(err)
    }

    bot.logger.info(`reddit client has completed auth process for username: ${config.get('modules.reddit-link-log.username')}`)

    const urlToRetrieve = match[0]

    return getUrl(urlToRetrieve, bot)
    .then(html => {
      let title = urlToRetrieve

      if (html) {
        // extract title
        const $ = cheerio.load(html)
        title = $('title').first().text().trim() || urlToRetrieve
      }

      // submit to reddit
      reddit.submit({
        url: urlToRetrieve,
        r: config.get('modules.reddit-link-log.subreddit'),
        title: title,
        save: true
      }, (err, id) => {
        if (err) {
          bot.logger.error(err)
          return Promise.resolve(err)
        }

        return Promise.resolve(id)
      })
    })
    .catch(err => {
      bot.logger.error(err.stack)
    })
  })
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
          bot.logger.info('ignoring image')
          return ''
        }
        break
      default:
        bot.logger.error(result.entity)
    }
  })
  .catch(err => {
    bot.logger.error(err)
  })
}

module.exports = RedditLinkLog