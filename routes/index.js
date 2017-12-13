'use strict'

const Router = require('koa-router')
const Config = require('../config')
const FormatResponse = require('../app/Middleware/FormatResponse')
const VerifyToken = require('../app/Middleware/VerifyToken')
const AuthController = require('../app/Controllers/AuthController')
const ArticleController = require('../app/Controllers/ArticleController')

module.exports = function () {
  const router = new Router({
    prefix: Config.app.baseUri
  })

  AuthController.init()
  router.post('/login', AuthController.login)
  router.post('/articles', FormatResponse, VerifyToken, ArticleController.create)

  return router
}
