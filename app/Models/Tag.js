'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema({
  name: {
    type: String,
    default: ''
  }
}, { versionKey: false })

module.exports = mongoose.model('Tag', TagSchema)
