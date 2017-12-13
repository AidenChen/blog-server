'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: String,
  password: String,
  nick: String,
  avatar: String,
  registered_at: String,
  logged_in_at: String
}, { versionKey: false })

module.exports = mongoose.model('User', UserSchema)
