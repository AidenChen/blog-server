const name = {
  UNKNOW_ERROR: 'UNKNOW_ERROR',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  MISSING_FIELD: 'MISSING_FIELD',
  MISSING_TOKEN: 'MISSING_TOKEN',
  MISSING_APP_ID: 'MISSING_APP_ID',
  MISSING_APP_SECRET: 'MISSING_APP_SECRET',
  INVALID_FIELD: 'INVALID_FIELD',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_AUTHENTICATION: 'INVALID_AUTHENTICATION',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  NOT_EXIST: 'NOT_EXIST',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
}

const detail = new Map()

detail.set(name.UNKNOW_ERROR, { code: 40000, message: '未知错误' })
detail.set(name.EXPIRED_TOKEN, { code: 40001, message: '令牌已过期' })
detail.set(name.MISSING_FIELD, { code: 42000, message: '参数不完整' })
detail.set(name.MISSING_TOKEN, { code: 42001, message: '缺少令牌' })
detail.set(name.MISSING_APP_ID, { code: 42002, message: '缺少应用ID' })
detail.set(name.MISSING_APP_SECRET, { code: 42003, message: '缺少应用密钥' })
detail.set(name.INVALID_FIELD, { code: 44000, message: '参数不合法' })
detail.set(name.INVALID_TOKEN, { code: 44001, message: '令牌不合法' })
detail.set(name.INVALID_AUTHENTICATION, { code: 44002, message: '用户名或密码错误' })
detail.set(name.ALREADY_EXISTS, { code: 46000, message: '对象已存在' })
detail.set(name.NOT_EXIST, { code: 48000, message: '对象不存在' })
detail.set(name.INTERNAL_SERVER_ERROR, { code: 50000, message: '服务器内部错误' })

module.exports = {
  name: name,
  detail: detail
}
