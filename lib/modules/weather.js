/**
 * Module to give weather details for given locations
 */
'use strict'

const config = require('config')
const BaeBaeModule = require('../baebae-module')
const request = require('../components/promise-request')
const logger = require('../components/logger')

const weatherUrlBase = 'http://api.openweathermap.org/data/2.5'

/**
 * This module retrieves and displays weather details for given locations
 */
class Weather extends BaeBaeModule {
  // default constructor
  constructor() {
    super()
  }

  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init(bot) { // eslint-disable-line no-unused-vars
    this.commands = {
      /**
       * Says how long the bot has been up
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      weather: (bot, nick, channel, data) => { // eslint-disable-line no-unused-vars
        if (!data) {
          bot.client.say(channel, 'Please enter a location')
          return
        }

        let location = data.trim()
        let mode = /^\d{5}$/.test(location) ? 'zip' : 'q'

        return getUrl(
          `${weatherUrlBase}/weather?${mode}=${location}&appid=${config.get('modules.weather.apiKey')}&units=imperial`
        )
        .then(result => {
          if (!result) {
            bot.client.say(channel, 'An error occurred while retrieving the weather.')
            return
          }

          const response = JSON.parse(result)
          bot.client.say(channel,
            `Weather for ${response.name} is currently: ${response.weather[0].description} at ${response.main.temp} F`
          )
        })
        .catch(logger.error)
      }
    }
  }
}

/**
 * Performs an http get for url
 * @param {string} urlToRetrieve The url to retrieve
 * @return {Promise} A promise that resolves to an http response
 */
function getUrl(urlToRetrieve) {
  logger.log('retrieving weather', urlToRetrieve)
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
        return result.entity
      default:
        logger.error(result.entity)
    }
  })
  .catch(err => {
    logger.error(err)
  })
}

module.exports = Weather
