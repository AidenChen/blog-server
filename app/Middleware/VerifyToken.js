'use strict'

const jwt = require('jsonwebtoken')
const Config = require('../../config')

module.exports = async function (ctx, next) {
  const authorization = ctx.get('Authorization')
  if (!authorization) {
    ctx.throw(401, '令牌不能为空')
  }

  const token = authorization.split('Bearer ')[1]
  try {
    await jwt.verify(token, Config.jwt.secret)
  } catch (err) {
    if ('TokenExpiredError' === err.name) {
      ctx.throw(401, '令牌已过期')
    }
    ctx.throw(401, '令牌不合法')
  }

  await next()
}
