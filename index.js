'use strict'

let mongoose = require('mongoose')
const Config = require('./config')
const Article = require('./app/Models/Article')
const Tag = require('./app/Models/Tag')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')()

mongoose.Promise = global.Promise
mongoose.connect(Config.mongodb.url, {
  useMongoClient: true,
  user: Config.mongodb.user,
  pass: Config.mongodb.pass
})
mongoose.connection.on('error', global.console.error)
const app = new Koa()
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(Config.app.port, () => {
  console.log('Listening: ' + Config.app.port)
})
