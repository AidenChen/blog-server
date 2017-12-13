const jwt = require('jsonwebtoken')
const Config = require('../../config')

module.exports = async function (ctx, next) {
  const authorization = ctx.get('Authorization')
  if (!authorization) {
    ctx.throw(401, 'no token detected in http header \'Authorization\'')
  }

  const token = authorization.split('Bearer ')[1]
  try {
    await jwt.verify(token, Config.jwt.secret)
  } catch (err) {
    if ('TokenExpiredError' === err.name) {
      ctx.throw(401, 'token expired')
    }
    ctx.throw(401, 'invalid token')
  }

  await next()
}
