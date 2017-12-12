'use strict'

const Koa = require('koa')
const router = require('./routes')()
const app = new Koa()
app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
