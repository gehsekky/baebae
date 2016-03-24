/**
 * A module for storing irc quotes
 */
'use strict'

let config = require('config')
let BaeBaeModule = require('../baebae-module')
let quoteDb = require('./quote/db')

/**
 * This module allows the saving of user quotes for later
 * recall. Supports random quote and fetching by ID.
 */
class Quote extends BaeBaeModule {
  init() {
    this.commands = {
      /**
       * Main quote command
       * @param {object} bot a reference to the bot
       * @param {string} nick the nick of user who gave command
       * @param {string} channel the channel command was given in
       * @param {data} anything after the command
       */
      quote: function (bot, nick, channel, data) {
        console.log('data', data)
        // get subcommand
        if (!data) {
          return quoteDb.Quote.findOne({
            order: [ quoteDb.sequelize.fn('RAND') ]
          })
          .then(result => {
            if (!result) {
              bot.client.say(channel, 'There is nothing in the database')
              return
            }

            bot.client.say(channel, formatQuote(result))
          })
        }

        // get subcommand
        let commandParts = data.split(' ')
   
        console.log('commandParts', commandParts)
        if (commandParts.length < 2)  {
          bot.client.say(channel, `@${nick}: Invalid number of arguments`)
          return
        }

        let subCommand = commandParts[0].toLowerCase()
        commandParts.splice(0, 1)
        data = commandParts.join(' ')

        switch(subCommand) {
          case 'add':
            return quoteDb.Quote.create({
              content: data
            })
            .then(created => {
              let msg = `Could not add quote`

              if (created) {
                msg = `Quote added to database`
              }

              bot.client.say(channel, msg)
            })
            .catch(err => {
              throw new Error(err)
            })
            break
          case 'delete':
          case 'remove':
            return quoteDb.Quote.destroy({
              where: {
                quoteId: data
              }
            })
            .then(result => {
              let msg = `Could not remove quote`

              if (result === 1) {
                msg = `Quote removed`
              }

              bot.client.say(channel, msg)
            })
            break
          case 'show':
            return quoteDb.Quote.findOne({
              where: {
                quoteId: data
              }
            })
            .then(result => {
              let msg = `Could not find quote`

              if (result) {
                msg = formatQuote(result)
              }

              bot.client.say(channel, msg)
            })
            break
          case 'search':
            data = data.replace(' ', '%').replace('*', '%')
            return quoteDb.Quote.findOne({
              where: {
                content:{
                  $like: `%${data}%`
                }
              },
              order: [ quoteDb.sequelize.fn('RAND') ]
            })
            .then(result => {
              let msg = `No results`

              if (result) {
                
              } else {
                msg = formatQuote(result)
              }

              bot.client.say(channel, msg)
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

function formatQuote(quote) {
  return `[${quote.quoteId}] ${quote.content}`
}

module.exports = Quote
