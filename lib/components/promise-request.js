const request = require('request')

/**
 * A promise wrapper for the request lib
 */
function promiseRequest(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, msg, response) => {
      if (err) {
        return reject(err)
      }

      return resolve({
        status: {
          code: msg.statusCode
        },
        entity: response,
        response: {
          headers: msg.headers
        }
      })
    })
  })
}

module.exports = promiseRequest
