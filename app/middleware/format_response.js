const Kamora = require('kamora')
const error = require('../../config/error')

function formatError (err) {
  let detail
  if (err.name) {
    detail = error.detail.get(err.name)
  } else {
    detail = error.detail.get(error.name.UNKNOW_ERROR)
  }

  err.code = detail.code
  err.message = err.message || detail.message

  return err
}

async function formatResponse (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof Kamora.Error) {
      err = formatError(err)

      ctx.status = err.status
      ctx.body = {
        code: err.code,
        msg: err.message
      }
    }
    throw err
  }

  if (ctx.status !== 200) {
    let err = new Kamora.Error(error.name.UNKNOW_ERROR, ctx.message, ctx.status)
    err = formatError(err)

    ctx.body = {
      code: err.code,
      msg: err.message
    }
    throw err
  }

  ctx.body = {
    code: 0,
    msg: '请求成功',
    data: ctx.body || {}
  }
}

module.exports = formatResponse
