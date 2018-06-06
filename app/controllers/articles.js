const Kamora = require('kamora')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')
const validate = require('../middleware/validate')
const error = require('../../config/error')
const jwtConfig = require('../../config/jwt')

const router = new Kamora.Router()
const Validator = Kamora.Validator
const Article = Kamora.Database.model('article')

router.push({
  method: 'post',
  path: '/',
  processors: [
    authenticate,
    validate({
      body: {
        title: Validator.string().required(),
        content: Validator.string().required(),
        abstract: Validator.string().required(),
        is_published: Validator.any(),
        tags: Validator.any()
      }
    }),
    async (ctx, next) => {
      const title = ctx.filter.body.title
      const content = ctx.filter.body.content
      const abstract = ctx.filter.body.abstract
      const is_published = ctx.filter.body.is_published
      const tags = ctx.filter.body.tags

      let data = {
        title,
        content,
        abstract,
        is_published
      }
      if (tags.length) {
        data.tags = tags.map((tag) => {
          return {
            _id: tag.id,
            name: tag.name
          }
        })
      }
      const article = new Article(data)
      let createdArticle = await article
        .save()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      await Article.populate(createdArticle, { path: 'tags' }, function (err, result) {
        createdArticle = result
      })

      ctx.body = createdArticle

      await next()
    }
  ]
})

router.push({
  method: 'delete',
  path: '/:id',
  processors: [
    authenticate,
    validate({
      params: {
        id: Validator.string().required()
      }
    }),
    async (ctx, next) => {
      const id = ctx.filter.params.id

      await Article
        .findByIdAndRemove(id)
        .catch((err) => {
          if ('CastError' === err.name) {
            throw new Kamora.Error(error.name.NOT_EXIST, '', 400)
          }
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {}

      await next()
    }
  ]
})

router.push({
  method: 'put',
  path: '/:id',
  processors: [
    authenticate,
    validate({
      params: {
        id: Validator.string().required()
      },
      body: {
        title: Validator.string().required(),
        content: Validator.string().required(),
        abstract: Validator.string().required(),
        is_published: Validator.any(),
        tags: Validator.any()
      }
    }),
    async (ctx, next) => {
      const id = ctx.filter.params.id

      let data = Object.assign(ctx.filter.body, { updated_at: Date.now() })
      if (ctx.filter.body.tags.length) {
        data.tags = ctx.filter.body.tags.map((tag) => {
          return {
            _id: tag.id,
            name: tag.name
          }
        })
      }
      await Article
        .findByIdAndUpdate(id, { $set: data })
        .catch((err) => {
          if ('CastError' === err.name) {
            throw new Kamora.Error(error.name.NOT_EXIST, '', 400)
          }
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {}

      await next()
    }
  ]
})

router.push({
  method: 'get',
  path: '/',
  processors: [
    validate({
      query: {
        index: Validator.number(),
        size: Validator.number(),
        tags: Validator.any()
      }
    }),
    async (ctx, next) => {
      const index = ctx.filter.query.index || 1
      const size = ctx.filter.query.size || 5
      const skip = (index - 1) * size
      const limit = size > 50 ? 50 : size
      const tags = ctx.filter.query.tags
      let isAdmin = false

      const authorization = ctx.get('Authorization')
      if (authorization) {
        const token = authorization.split('Bearer ')[1]
        try {
          await jwt.verify(token, jwtConfig.secret)
          isAdmin = true
        } catch (err) {
          if (err.name === 'TokenExpiredError') {
            throw new Kamora.Error(error.name.EXPIRED_TOKEN)
          }
          throw new Kamora.Error(error.name.INVALID_TOKEN)
        }
      }

      let condition = {}
      if (tags) {
        let tagsArr = tags.split(',')
        tagsArr = tagsArr.map((tag) => {
          return mongoose.Types.ObjectId(tag)
        })
        condition.tags = {'$in': tagsArr}
      }
      if (!isAdmin) {
        condition.is_published = true
      }

      const articles = await Article
        .aggregate([
          {
            $match: condition
          },
          {
            $lookup: {
              from: 'tags',
              localField: 'tags',
              foreignField: '_id',
              as: 'tags'
            }
          },
          {
            $sort: {
              '_id': -1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: parseInt(limit)
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              title: 1,
              content: 1,
              abstract: 1,
              tags: {
                $map: {
                  input: "$tags",
                  as: "tag",
                  in: {
                    id: '$$tag._id',
                    name: '$$tag.name'
                  }
                }
              },
              is_published: 1,
              created_at: {
                $dateToString: {
                  format: '%Y-%m-%d %H:%M:%S',
                  date: {
                    $add: ['$created_at', 8 * 60 * 60 * 1000]
                  }
                }
              },
              updated_at: {
                $dateToString: {
                  format: '%Y-%m-%d %H:%M:%S',
                  date: {
                    $add: ['$updated_at', 8 * 60 * 60 * 1000]
                  }
                }
              }
            }
          }
        ])
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      const count = await Article
        .find(condition)
        .count()
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {
        items: articles,
        total: count
      }

      await next()
    }
  ]
})

router.push({
  method: 'get',
  path: '/:id',
  processors: [
    validate({
      params: {
        id: Validator.string().required()
      }
    }),
    async (ctx, next) => {
      const id = ctx.filter.params.id

      const article = await Article
        .aggregate([
          {
            $match: {
              _id: Kamora.Database.Types.ObjectId(id)
            }
          },
          {
            $lookup: {
              from: 'tags',
              localField: 'tags',
              foreignField: '_id',
              as: 'tags'
            }
          },
          {
            $project: {
              _id: 0,
              id: '$_id',
              title: 1,
              content: 1,
              abstract: 1,
              tags: {
                $map: {
                  input: "$tags",
                  as: "tag",
                  in: {
                    id: '$$tag._id',
                    name: '$$tag.name'
                  }
                }
              },
              is_published: 1,
              created_at: {
                $dateToString: {
                  format: '%Y-%m-%d %H:%M:%S',
                  date: {
                    $add: ['$created_at', 8 * 60 * 60 * 1000]
                  }
                }
              },
              updated_at: {
                $dateToString: {
                  format: '%Y-%m-%d %H:%M:%S',
                  date: {
                    $add: ['$updated_at', 8 * 60 * 60 * 1000]
                  }
                }
              }
            }
          }
        ])
        .exec()
        .catch((err) => {
          if ('CastError' === err.name) {
            throw new Kamora.Error(error.name.NOT_EXIST, '', 400)
          }
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      if (!article) {
        throw new Kamora.Error(error.name.NOT_EXIST, '', 400)
      }

      ctx.body = article

      await next()
    }
  ]
})

module.exports = router
