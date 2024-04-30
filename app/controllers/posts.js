const Kamora = require('kamora')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')
const validate = require('../middleware/validate')
const error = require('../../config/error')
const jwtConfig = require('../../config/jwt')

const router = new Kamora.Router()
const Validator = Kamora.Validator
const Post = Kamora.Database.model('post')

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
      const post = new Post(data)
      let createdPost = await post
        .save()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      await Post.populate(createdPost, { path: 'tags' }, function (err, result) {
        createdPost = result
      })

      ctx.body = createdPost

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

      await Post
        .findByIdAndRemove(id)
        .catch((err) => {
          if ('CastError' === err.name) {
            throw new Kamora.Error(error.name.NOT_EXIST)
          }
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {}

      await next()
    }
  ]
})

router.push({
  method: 'patch',
  path: '/:id',
  processors: [
    authenticate,
    validate({
      params: {
        id: Validator.string().required()
      },
      body: {
        title: Validator.any(),
        content: Validator.any(),
        abstract: Validator.any(),
        is_published: Validator.any(),
        tags: Validator.any()
      }
    }),
    async (ctx, next) => {
      const id = ctx.filter.params.id

      let data = Object.assign(ctx.filter.body, { updated_at: Date.now() })
      if (ctx.filter.body.tags && ctx.filter.body.tags.length) {
        data.tags = ctx.filter.body.tags.map((tag) => {
          return {
            _id: tag.id,
            name: tag.name
          }
        })
      }
      await Post
        .findByIdAndUpdate(id, { $set: data })
        .catch((err) => {
          if ('CastError' === err.name) {
            throw new Kamora.Error(error.name.NOT_EXIST)
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
            throw new Kamora.Error(error.name.LOGIN_REQUIRED, '令牌已过期，请重新登录')
          }
          throw new Kamora.Error(error.name.LOGIN_REQUIRED, '令牌不合法，请重新登录')
        }
      }

      let condition = {}
      if (tags) {
        let tagsArr = tags.split(',')
        tagsArr = tagsArr.map((tag) => {
          return Kamora.Database.Types.ObjectId(tag)
        })
        condition.tags = {'$in': tagsArr}
      }
      if (!isAdmin) {
        condition.is_published = true
      }

      const posts = await Post
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
              content: isAdmin ? 1 : 0,
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
                  format: '%Y/%m/%d',
                  date: {
                    $add: ['$created_at', 8 * 60 * 60 * 1000]
                  }
                }
              },
              updated_at: {
                $dateToString: {
                  format: '%Y/%m/%d',
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
      const count = await Post
        .find(condition)
        .count()
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {
        items: posts,
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

      const post = await Post
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
                  format: '%Y/%m/%d',
                  date: {
                    $add: ['$created_at', 8 * 60 * 60 * 1000]
                  }
                }
              },
              updated_at: {
                $dateToString: {
                  format: '%Y/%m/%d',
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
            throw new Kamora.Error(error.name.NOT_EXIST)
          }
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      if (!post) {
        throw new Kamora.Error(error.name.NOT_EXIST)
      }

      ctx.body = post[0]

      await next()
    }
  ]
})

module.exports = router
