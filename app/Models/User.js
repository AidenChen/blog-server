'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
moment.locale('zh-cn')

const UserSchema = new Schema({
  username: String,
  password: String,
  nick: String,
  avatar: String,
  registered_at: String,
  logged_in_at: String
}, { versionKey: false })

UserSchema.pre('save', function (next) {
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  if (this.isNew) {
    this.registered_at = time
  }

  next()
})

module.exports = mongoose.model('User', UserSchema)
