'use strict'

const Config = require('./config')
let mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(Config.mongodb.url, {
  useMongoClient: true,
  user: Config.mongodb.user,
  pass: Config.mongodb.pass
})
mongoose.connection.on('error', global.console.error)

const Koa = require('koa')
const convert = require('koa-convert')
const onerror = require('koa-onerror')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const User = require('./app/Models/User')
const Article = require('./app/Models/Article')
const Tag = require('./app/Models/Tag')
const router = require('./routes')()

const app = new Koa()
// onerror(app)
app
  .use(convert(cors({
    expose: ['Content-Type', 'Authorization']
  })))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
app.listen(Config.app.port, () => {
  console.log('Listening: ' + Config.app.port)
})
