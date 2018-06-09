const Kamora = require('kamora')
const authenticate = require('../middleware/authenticate')
const validate = require('../middleware/validate')
const error = require('../../config/error')

const router = new Kamora.Router()
const Validator = Kamora.Validator
const Tag = Kamora.Database.model('tag')

router.push({
  method: 'post',
  path: '/',
  processors: [
    authenticate,
    validate({
      body: {
        name: Validator.string().required()
      }
    }),
    async (ctx, next) => {
      const name = ctx.filter.body.name

      const existingTag = await Tag
        .findOne({ name })
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      if (existingTag) {
        throw new Kamora.Error(error.name.ALREADY_EXISTS)
      }

      const tag = new Tag({
        name: name
      })
      const createdTag = await tag
        .save()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = createdTag

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

      await Tag
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
  method: 'put',
  path: '/:id',
  processors: [
    authenticate,
    validate({
      params: {
        id: Validator.string().required()
      },
      body: {
        name: Validator.string().required()
      }
    }),
    async (ctx, next) => {
      const id = ctx.filter.params.id

      await Tag
        .findByIdAndUpdate(id, { $set: ctx.filter.body })
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
    async (ctx, next) => {
      const tags = await Tag
        .find()
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      const count = await Tag
        .find()
        .count()
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = {
        items: tags,
        total: count
      }

      await next()
    }
  ]
})

module.exports = router
