const logService = require('../services/log')

async function log (ctx, next) {
  const start = new Date()
  let duration
  try {
    await next()
    duration = new Date() - start
    logService.logApi(ctx, duration)
  } catch (err) {
    duration = new Date() - start
    logService.logError(ctx, duration, err)
  }
}

module.exports = log
