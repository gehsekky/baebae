let http  = require('http')
let https = require('https')
let url   = require('url')

/**
 * A wrapper for the native node http request object which returns a promise
 * and has support for cookies and redirects.
 */
function Request(options) {
  // define some default settings
  let defaultOptions = {
    protocol: 'http:',
    method: 'get',
    path: '/',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
    }
  }

  // wrap everything in a promise that we return
  return new Promise(function (resolve, reject) {
    if (!options.url) {
      throw new Error('no url provided')
    }

    let urlObj = url.parse(options.url)

    options.host = urlObj.host
    options.path = urlObj.path
    options.protocol = urlObj.protocol

    // merge provided options on top of default options
    options = Object.assign({}, defaultOptions, options)

    // change protocol handler to whichever url specifies
    let protocol = http
    if (options.protocol === 'https:') {
      protocol = https
    }

    // create http request using provided options
    let req = protocol.request(options, response => {
      // check response for cookie headers. set cookie if necessary.
      if (response.headers['set-cookie']) {
        options.headers.cookie = response.headers['set-cookie']
      }

      // check response status code to see if this is a redirect
      if ([301, 302, 303, 307, 308].indexOf(response.statusCode) > -1) {
        resolve(Request(Object.assign({}, options, { url: response.headers['location'] })))
      }

      let data = ''

      // aggregate the response chunk by chunk
      response.on('data', chunk => {
        data += chunk
      })

      // when finished reading response, resolve promise with result and some useful data
      response.on('end', () => {
        resolve({
          requestOptions: options,
          response: response,
          entity: data,
          status: {
            code: response.statusCode,
            message: response.statusMessage
          }
        })
      })

      // catch response errors
      response.on('error', err => {
        reject(err)
      })
    })

    // if this is a writeable operation, write to stream
    if (options.data) {
      req.write(options.data)
    }

    // end request
    req.end()
  })
}

module.exports = Request