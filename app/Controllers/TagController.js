'use strict'

const mongoose = require('mongoose')
const Tag = mongoose.model('Tag')

exports.create = async function (ctx) {
  const name = ctx.request.body.name

  if (!name) {
    ctx.throw(400, '名称不能为空')
  }

  const tagExists = await Tag.findOne({ name: name }).catch(err => {
    ctx.throw(500, '服务器内部错误')
  })
  if (tagExists) {
    ctx.throw(400, '标签已存在')
  }

  const tag = new Tag({
    name: name
  })
  const createdTag = await tag.save().catch(err => {
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: tag
  }
}

exports.destroy = async function (ctx) {
  const id = ctx.params.id

  await Tag.findByIdAndRemove(id).catch(err => {
    if ('CastError' === err.name) {
      ctx.throw(400, '标签不存在')
    }
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: {}
  }
}

exports.update = async function (ctx) {
  const id = ctx.params.id
  const name = ctx.request.body.name

  if (!name) {
    ctx.throw(400, '名称不能为空')
  }

  await Tag.findByIdAndUpdate(id, { $set: ctx.request.body }).catch(err => {
    if ('CastError' === err.name) {
      ctx.throw(400, '标签不存在')
    }
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: {}
  }
}

exports.index = async function (ctx) {
  const tags = await Tag.find().catch(err => {
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: {
      total: 0,
      items: tags
    }
  }
}
