const Kamora = require('kamora')
const error = require('../../config/error')

function formatError (err) {
  let detail
  if (err.name) {
    detail = error.detail.get(err.name)
  } else {
    detail = error.detail.get(error.name.REQUEST_FAILED)
  }

  err.status = err.status || detail.status
  err.code = detail.code
  err.message = err.message || detail.message

  return err
}

async function formatResponse (ctx, next) {
  ctx.filter = ctx.filter || {}
  try {
    await next()
  } catch (err) {
    if (err instanceof Kamora.Error) {
      err = formatError(err)

      ctx.status = err.status
      ctx.body = {
        code: err.code,
        message: err.message
      }
    }
    throw err
  }

  if (ctx.status !== 200) {
    let err = new Kamora.Error(error.name.REQUEST_FAILED, ctx.message, ctx.status)
    err = formatError(err)

    ctx.status = err.status
    ctx.body = {
      code: err.code,
      message: err.message
    }
    throw err
  }

  ctx.body = {
    code: 'successful_request',
    message: '请求成功',
    data: ctx.body || {}
  }
}

module.exports = formatResponse
