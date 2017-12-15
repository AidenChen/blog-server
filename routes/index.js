'use strict'

const Router = require('koa-router')
const Config = require('../config')
const FormatResponse = require('../app/Middleware/FormatResponse')
const VerifyToken = require('../app/Middleware/VerifyToken')
const AuthController = require('../app/Controllers/AuthController')
const ArticleController = require('../app/Controllers/ArticleController')
const TagController = require('../app/Controllers/TagController')

module.exports = function () {
  const router = new Router({
    prefix: Config.app.baseUri
  })

  AuthController.init()
  router.post('/login', FormatResponse, AuthController.login)

  router.post('/articles', FormatResponse, VerifyToken, ArticleController.create)
  router.del('/articles/:id', FormatResponse, VerifyToken, ArticleController.destroy)
  router.put('/articles/:id', FormatResponse, VerifyToken, ArticleController.update)
  router.get('/articles', FormatResponse, ArticleController.index)
  router.get('/articles/:id', FormatResponse, ArticleController.show)

  router.post('/tags', FormatResponse, VerifyToken, TagController.create)
  router.del('/tags/:id', FormatResponse, VerifyToken, TagController.destroy)
  router.put('/tags/:id', FormatResponse, VerifyToken, TagController.update)
  router.get('/tags', FormatResponse, TagController.index)

  return router
}
