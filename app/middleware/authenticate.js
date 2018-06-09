const Kamora = require('kamora')
const jwt = require('jsonwebtoken')
const error = require('../../config/error')
const jwtConfig = require('../../config/jwt')

const User = Kamora.Database.model('user')

module.exports = async (ctx, next) => {
  const authorization = ctx.get('Authorization')
  if (!authorization) {
    throw new Kamora.Error(error.name.LOGIN_REQUIRED, '用户认证失败')
  }

  const token = authorization.split('Bearer ')[1]
  try {
    const decoded = await jwt.verify(token, jwtConfig.secret)

    const user = await User
      .findById(decoded.uid)
      .catch(() => {
        throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
      })

    ctx.filter = ctx.filter || {}
    ctx.filter.user = user
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Kamora.Error(error.name.LOGIN_REQUIRED, '令牌已过期，请重新登录')
    }
    throw new Kamora.Error(error.name.LOGIN_REQUIRED, '令牌不合法，请重新登录')
  }

  await next()
}
