/**
 * Tells how long the bot has been up
 * @module ModuleUptime
 */
'use strict'

let moment = require('moment')
let BaeBaeModule = require('../baebae-module')

/**
 * This module provides basic uptime information.
 */
class Uptime extends BaeBaeModule {
  constructor() {
    super()
    this.loadTime = null
  }

  humanizeTimeDiff(startTime, endTime) {
    let units = []

    // get years
    let years = endTime.diff(startTime, 'years')
    units.push({
      unit: 'year',
      data: years
    })
    startTime = startTime.add(years, 'years')

    // get months
    let months = endTime.diff(startTime, 'months')
    units.push({
      unit: 'month',
      data: months
    })
    startTime = startTime.add(months, 'months')

    // get days
    let days = endTime.diff(startTime, 'days')
    units.push({
      unit: 'day',
      data: days
    })
    startTime = startTime.add(days, 'days')

    // get hours
    let hours = endTime.diff(startTime, 'hours')
    units.push({
      unit: 'hour',
      data: hours
    })
    startTime = startTime.add(hours, 'hours')

    // get minutes
    let minutes = endTime.diff(startTime, 'minutes')
    units.push({
      unit: 'minute',
      data: minutes
    })
    startTime = startTime.add(minutes, 'minutes')

    // get seconds
    let seconds = endTime.diff(startTime, 'seconds')
    units.push({
      unit: 'second',
      data: seconds
    })

    // build string
    let diffUnits = units.map(item => {
      if (item.data === 0) {
        return null
      }

      if (item.data !== 1) {
        item.unit += 's'
      }

      return `${item.data} ${item.unit}`
    })
    .filter(item => {
      return item !== null
    })

    let diffText = ''
    for (let i = 0, lim = diffUnits.length; i < lim; i++) {
      if (i === lim - 1 && lim > 1) {
        diffText += `and `
      }

      diffText += diffUnits[i] + (lim > 2 && i !== lim - 1 ? ', ' : ' ')
    }

    return diffText.trim()
  }

  init(bot) {
    this.commands = {
      /**
       * Says how long the bot has been up
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      uptime: (bot, nick, channel, data) => {
        let diffText = this.humanizeTimeDiff(moment(this.loadTime), moment())

        bot.client.say(channel, `I've been up for ${diffText}`)
      }
    }


    // initialize the cached start time
    this.loadTime = new Date()
  }
}

module.exports = Uptime
