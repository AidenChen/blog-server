'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Config = require('../../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.init = async function (ctx) {
  const users = await User.find().exec().catch(err => {
    console.log(err)
  })
  if (users.length !== 0) {
    return
  }

  const salt = await bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(Config.admin.password, salt)
  const user = new User({
    username: Config.admin.username,
    password: hash,
    nick: Config.admin.username,
    avatar: '',
    registered_at: new Date()
  })
  await user.save().catch(err => {
    console.log(err)
  })
}

exports.login = async function (ctx) {
  const username = ctx.request.body.username
  const password = ctx.request.body.password

  const user = await User.findOne({ username, }).exec().catch(err => {
    console.log(err)
  })
  if (!user) {
    ctx.throw(401, '用户名错误')
  }
  if (!bcrypt.compareSync(password, user.password)) {
    ctx.throw(401, '密码错误')
  }
  
  const token = jwt.sign({
    uid: user._id,
    name: user.nick,
    exp: Math.floor(Date.now() / 1000) + Config.jwt.ttl * 60
  }, Config.jwt.secret)

  ctx.body = {
    id: user._id,
    nick: user.nick,
    token: `Bearer ${token}`
  }
}
