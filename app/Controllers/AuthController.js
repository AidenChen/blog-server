'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Config = require('../../config')
const bcrypt = require('bcryptjs')

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
