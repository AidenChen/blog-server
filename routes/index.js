'use strict'

const Router = require('koa-router')
const Config = require('../config')
const AuthController = require('../app/Controllers/AuthController')
const ArticleController = require('../app/Controllers/ArticleController')

module.exports = function () {
  const router = new Router({
    prefix: Config.app.baseUri
  })

  AuthController.init()
  router.post('/articles', ArticleController.create)

  return router
}
