'use strict'

const mongoose = require('mongoose')
const Article = mongoose.model('Article')

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
