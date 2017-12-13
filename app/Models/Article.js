'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema
moment.locale('zh-cn')

const ArticleSchema = new Schema({
  title: String,
  content: String,
  abstract: String,
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  is_published: {
    type: Boolean,
    default: false
  },
  created_at: String,
  updated_at: String
}, { versionKey: false })

ArticleSchema.pre('save', function (next) {
  const time = moment().format('YYYY-MM-DD HH:mm:ss')
  if (this.isNew) {
    this.created_at = this.updated_at = time
  } else {
    this.updated_at = time
  }

  next()
})

module.exports = mongoose.model('Article', ArticleSchema)
