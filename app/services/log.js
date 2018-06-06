const Kamora = require('kamora')
const logConfig = require('../../config/log')

const Logger = Kamora.Logger

Logger.configure(logConfig)
const errorLogger = Logger.getLogger('errorLogger')
const apiLogger = Logger.getLogger('apiLogger')

function logError (ctx, duration, error) {
  if (ctx && error) {
    errorLogger.error(formatError(ctx, duration, error))
  }
}

function logApi (ctx, duration) {
  if (ctx) {
    apiLogger.info(formatApi(ctx, duration))
  }
}

const formatRequest = function (req, duration) {
  let logText = ''
  const method = req.method
  logText += 'request method: ' + method + '\n'
  logText += 'request originalUrl: ' + req.originalUrl + '\n'
  logText += 'request client ip: ' + req.ip + '\n'
  if (method === 'GET') {
    logText += 'request query: ' + '\n' + JSON.stringify(req.query) + '\n'
  } else {
    logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n'
  }
  logText += 'response time: ' + duration + '\n'
  return logText
}

const formatError = function (ctx, duration, error) {
  let logText = ''
  logText += '\n' + '*************** error log start ***************' + '\n'
  logText += formatRequest(ctx.request, duration)
  logText += 'error status: ' + error.status + '\n'
  logText += 'error name: ' + error.name + '\n'
  logText += 'error code: ' + error.code + '\n'
  logText += 'error message: ' + error.message + '\n'
  logText += 'error stack: ' + (error.stack ? error.stack : '') + '\n'
  logText += '*************** error log end ***************' + '\n'
  return logText
}

const formatApi = function (ctx, duration) {
  let logText = ''
  logText += '\n' + '*************** api log start ***************' + '\n'
  logText += formatRequest(ctx.request, duration)
  logText += 'response status: ' + ctx.status + '\n'
  logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n'
  logText += '*************** api log end ***************' + '\n'
  return logText
}

module.exports = {
  logError: logError,
  logApi: logApi
}
