/**
 * Tells how long the bot has been up
 * @module ModuleUptime
 */
'use strict'

const moment = require('moment')
const BaeBaeModule = require('../baebae-module')

/**
 * This module provides basic uptime information.
 */
class Uptime extends BaeBaeModule {
  // default constructor
  constructor() {
    super()
    this.loadTime = null
  }

  /**
   * Formats a time difference unit into human readable text
   * @param {Object} startTime A moment object representing the start time
   * @param {Object} endTime A moment object representing the finish time (the later of the two)
   * @return {string} formatted string representation of time difference
   */
  humanizeTimeDiff(startTime, endTime) {
    const units = []

    // get years
    const years = endTime.diff(startTime, 'years')
    units.push({
      unit: 'year',
      data: years
    })
    startTime = startTime.add(years, 'years')

    // get months
    const months = endTime.diff(startTime, 'months')
    units.push({
      unit: 'month',
      data: months
    })
    startTime = startTime.add(months, 'months')

    // get days
    const days = endTime.diff(startTime, 'days')
    units.push({
      unit: 'day',
      data: days
    })
    startTime = startTime.add(days, 'days')

    // get hours
    const hours = endTime.diff(startTime, 'hours')
    units.push({
      unit: 'hour',
      data: hours
    })
    startTime = startTime.add(hours, 'hours')

    // get minutes
    const minutes = endTime.diff(startTime, 'minutes')
    units.push({
      unit: 'minute',
      data: minutes
    })
    startTime = startTime.add(minutes, 'minutes')

    // get seconds
    const seconds = endTime.diff(startTime, 'seconds')
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

  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init(bot) {
    this.commands = {
      /**
       * Says how long the bot has been up
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      uptime: (bot, nick, channel, data) => {
        const diffText = this.humanizeTimeDiff(moment(this.loadTime), moment())

        bot.client.say(channel, `I've been up for ${diffText}`)
      }
    }


    // initialize the cached start time
    this.loadTime = new Date()
  }
}

module.exports = Uptime
