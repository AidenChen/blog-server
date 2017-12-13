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
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
}, { versionKey: false })

ArticleSchema.path('created_at').get(function (v) {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
ArticleSchema.path('updated_at').get(function (v) {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})

module.exports = mongoose.model('Article', ArticleSchema)
