/**
 * A module for storing irc quotes
 */
'use strict'

const config       = require('config')
const BaeBaeModule = require('../baebae-module')
const quoteDb      = require('./quote/db')

/**
 * This module allows the saving of user quotes for later
 * recall. Supports random quote and fetching by ID.
 */
class Quote extends BaeBaeModule {
  /**
   * required module initialize function
   * @param {BaeBae} bot A reference to the bot instance
   */
  init() {
    this.commands = {
      /**
       * Main quote command
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {string} data anything after the command
       */
      quote: function (bot, nick, channel, data) {
        // default action is to print random quote
        if (!data) {
          return quoteDb.Quote.findOne({
            where: {
              channel: channel
            },
            order: [ quoteDb.sequelize.fn('RAND') ]
          })
          .then(result => {
            if (!result) {
              bot.client.say(channel, 'There is nothing in the database')
              return
            }

            bot.client.say(channel, formatQuote(result))
          })
          .catch(err => {
            console.error(err.stack)
            throw new Error(err)
          })
        }

        // get subcommand
        let commandParts = data.split(' ')

        if (commandParts.length < 2)  {
          bot.client.say(channel, `@${nick}: Invalid number of arguments`)
          return
        }

        const subCommand = commandParts[0].toLowerCase()
        commandParts.splice(0, 1)
        data = commandParts.join(' ')

        switch(subCommand) {
          case 'add':
            return quoteDb.Quote.create({
              content: data,
              channel: channel,
              addedBy: nick
            })
            .then(created => {
              let msg = `Could not add quote`

              if (created) {
                msg = `Quote added to database`
              }

              bot.client.say(channel, msg)
            })
            .catch(err => {
              console.error(err.stack)
              throw new Error(err)
            })
            break
          case 'delete':
          case 'remove':
            return quoteDb.Quote.destroy({
              where: {
                quoteId: data,
                channel: channel
              }
            })
            .then(result => {
              let msg = `Could not remove quote`

              if (result === 1) {
                msg = `Quote removed`
              }

              bot.client.say(channel, msg)
            })
            .catch(err => {
              console.error(err.stack)
              throw new Error(err)
            })
            break
          case 'show':
            return quoteDb.Quote.findOne({
              where: {
                quoteId: data,
                channel: channel
              }
            })
            .then(result => {
              let msg = `Could not find quote`

              if (result) {
                msg = formatQuote(result)
              }

              bot.client.say(channel, msg)
            })
            .catch(err => {
              console.error(err.stack)
              throw new Error(err)
            })
            break
          case 'search':
            data = data.replace(/[\s*]+/ig, '%')
            return quoteDb.Quote.findOne({
              where: {
                content:{
                  $like: `%${data}%`
                },
                channel: channel
              },
              order: [ quoteDb.sequelize.fn('RAND') ]
            })
            .then(result => {
              let msg = `No results`

              if (result) {
                msg = formatQuote(result)
              }

              bot.client.say(channel, msg)
            })
            .catch(err => {
              console.error(err.stack)
              throw new Error(err)
            })
            break
          default:
            bot.client.say(channel, `@${nick}: Invalid subcommand`)
            return
        }
      }
    }

    // options sanity check
    if (!config.has('modules.quote')) {
      throw new Error('Quote module has not been configured')
    }
  }
}

/**
 * Formats the quote for display in the channel
 * @param {Object} quote An object with quote data
 * @return {string} The formatted quote
 */
function formatQuote(quote) {
  return `[${quote.quoteId}] ${quote.content}`
}

module.exports = Quote
