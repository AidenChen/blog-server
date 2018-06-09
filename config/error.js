const name = {
  SUCCESSFUL_REQUEST: 'SUCCESSFUL_REQUEST',
  REQUEST_FAILED: 'REQUEST_FAILED',
  LOGIN_REQUIRED: 'LOGIN_REQUIRED',
  INVALID_FORMAT: 'INVALID_FORMAT',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_DATA: 'INVALID_DATA',
  NOT_EXIST: 'NOT_EXIST',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
}

const detail = new Map()

detail.set(name.SUCCESSFUL_REQUEST, { status: 200, code: 'successful_request', message: '请求成功' })
detail.set(name.REQUEST_FAILED, { status: 400, code: 'request_failed', message: '请求失败' })
detail.set(name.LOGIN_REQUIRED, { status: 401, code: 'login_required', message: '请先登录' })
detail.set(name.INVALID_FORMAT, { status: 400, code: 'invalid_format', message: '格式不合法' })
detail.set(name.PERMISSION_DENIED, { status: 403, code: 'permission_denied', message: '操作未授权' })
detail.set(name.INVALID_DATA, { status: 400, code: 'invalid_data', message: '数据不可用' })
detail.set(name.NOT_EXIST, { status: 404, code: 'not_exist', message: '数据不存在' })
detail.set(name.ALREADY_EXISTS, { status: 400, code: 'already_exists', message: '数据已存在' })
detail.set(name.INTERNAL_SERVER_ERROR, { status: 500, code: 'internal_server_error', message: '服务器内部错误' })

module.exports = {
  name: name,
  detail: detail
}
