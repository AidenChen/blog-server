'use strict'

const mongoose = require('mongoose')
const moment = require('moment')
const Article = mongoose.model('Article')
moment.locale('zh-cn')

exports.create = async function (ctx) {
  const title = ctx.request.body.title
  const content = ctx.request.body.content
  const abstract = ctx.request.body.abstract
  const is_published = ctx.request.body.is_published
  const tags = ctx.request.body.tags

  if (!title) {
    ctx.throw(400, '标题不能为空')
  }
  if (!content) {
    ctx.throw(400, '内容不能为空')
  }
  if (!abstract) {
    ctx.throw(400, '摘要不能为空')
  }

  const article = new Article({
    title,
    content,
    abstract,
    is_published,
    tags
  })

  let createdArticle = await article.save().catch(err => {
    ctx.throw(500, '服务器内部错误')
  })
  await Article.populate(createdArticle, { path: 'tags' }, function (err, result) {
    createdArticle = result
  })

  ctx.body = {
    data: createdArticle
  }
}

exports.destroy = async function (ctx) {
  const id = ctx.params.id

  await Article.findByIdAndRemove(id).catch(err => {
    if ('CastError' === err.name) {
      ctx.throw(400, '文章不存在')
    }
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: {}
  }
}

exports.update = async function (ctx) {
  const id = ctx.params.id
  const title = ctx.request.body.title
  const content = ctx.request.body.content
  const abstract = ctx.request.body.abstract
  const is_published = ctx.request.body.is_published
  const tags = ctx.request.body.tags

  if (!title) {
    ctx.throw(400, '标题不能为空')
  }
  if (!content) {
    ctx.throw(400, '内容不能为空')
  }
  if (!abstract) {
    ctx.throw(400, '摘要不能为空')
  }

  await Article.findByIdAndUpdate(id, { $set: Object.assign(ctx.request.body, { updated_at: moment().format('YYYY-MM-DD HH:mm:ss') }) }).catch(err => {
    if ('CastError' === err.name) {
      ctx.throw(400, '文章不存在')
    }
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: {}
  }
}

exports.index = async function (ctx) {
  const index = ctx.query.index || 1
  const size = ctx.query.size || 5
  const skip = (index - 1) * size
  const limit = size > 50 ? 50 : size
  const tags = ctx.query.tags
  let articles
  let count

  if (!tags) {
    articles = await Article.find()
      .populate('tags')
      .sort({ '_id': -1 })
      .skip(skip)
      .limit(limit)
      .catch(err => {
        ctx.throw(500, '服务器内部错误')
      })
    count = await Article.count().catch(err => {
      ctx.throw(500, '服务器内部错误')
    })
  } else {
    let tagsArr = tags.split(',')
    articles = await Article.find({
      tags: { '$in': tagsArr }
    })
      .populate('tags')
      .sort({ '_id': -1 })
      .skip(skip)
      .limit(limit)
      .catch(err => {
        ctx.throw(500, '服务器内部错误')
      })
    count = await Article.find({
      tags: { '$in': tagsArr }
    }).count().catch(err => {
      ctx.throw(500, '服务器内部错误')
    })
  }

  ctx.body = {
    data: {
      total: count,
      items: articles
    }
  }
}

exports.show = async function (ctx) {
  const id = ctx.params.id

  const article = await Article.findById(id).catch(err => {
    if ('CastError' === err.name) {
      ctx.throw(400, '文章不存在')
    }
    ctx.throw(500, '服务器内部错误')
  })

  ctx.body = {
    data: article
  }
}
