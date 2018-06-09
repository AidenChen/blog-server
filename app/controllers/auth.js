const Kamora = require('kamora')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validate = require('../middleware/validate')
const error = require('../../config/error')
const jwtConfig = require('../../config/jwt')

const router = new Kamora.Router()
const Validator = Kamora.Validator
const User = Kamora.Database.model('user')

router.push({
  method: 'post',
  path: '/init',
  processors: [
    validate({
      body: {
        username: Validator.string().regex(/^[a-zA-Z0-9-_.]{3,30}$/).required(),
        password: Validator.string().regex(/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/).required()
      }
    }),
    async (ctx, next) => {
      const username = ctx.filter.body.username
      const password = ctx.filter.body.password

      const users = await User
        .find()
        .exec()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      if (users.length !== 0) {
        throw new Kamora.Error(error.name.ALREADY_EXISTS)
      }

      const salt = await bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const user = new User({
        username,
        password: hash,
        nick: username,
        avatar: ''
      })
      const createdUser = await user
        .save()
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })

      ctx.body = createdUser

      await next()
    }
  ]
})

router.push({
  method: 'post',
  path: '/login',
  processors: [
    validate({
      body: {
        username: Validator.string().regex(/^[a-zA-Z0-9-_.]{3,30}$/).required(),
        password: Validator.string().regex(/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/).required()
      }
    }),
    async (ctx, next) => {
      const username = ctx.filter.body.username
      const password = ctx.filter.body.password

      const user = await User
        .findOne({ username })
        .catch(() => {
          throw new Kamora.Error(error.name.INTERNAL_SERVER_ERROR)
        })
      if (!user) {
        throw new Kamora.Error(error.name.NOT_EXIST)
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new Kamora.Error(error.name.REQUEST_FAILED, '用户名或密码错误')
      }

      const token = jwt.sign({
        uid: user._id,
        name: user.nick,
        exp: Math.floor(Date.now() / 1000) + jwtConfig.ttl * 60
      }, jwtConfig.secret)

      ctx.set('Authorization', `Bearer ${token}`)
      ctx.body = user

      await next()
    }
  ]
})

module.exports = router
