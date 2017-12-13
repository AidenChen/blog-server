'use strict'

module.exports = async function (ctx, next) {
  try {
    await next()
  } catch(e) {
    ctx.status = e.status
    ctx.body = {
      message: e.message
    }
  }
}
