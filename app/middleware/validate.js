const _ = require('lodash')
const Kamora = require('kamora')
const error = require('../../config/error')

const Validator = Kamora.Validator

module.exports = (options) => {
  return async (ctx, next) => {
    let result = new Map()
    const validatorOptions = {
      stripUnknown: true
    }

    if (!_.isEmpty(options.params)) {
      result.set('params', Validator.validate(ctx.params, options.params, validatorOptions))
    }

    if (!_.isEmpty(options.query)) {
      result.set('query', Validator.validate(ctx.query, options.query, validatorOptions))
    }

    if (!_.isEmpty(options.body)) {
      result.set('body', Validator.validate(ctx.request.body, options.body, validatorOptions))
    }

    ctx.filter = ctx.filter || {}
    for (let [key, value] of result) {
      if (value.error) {
        throw new Kamora.Error(error.name.INVALID_FORMAT, value.error.details[0].message)
      } else {
        ctx.filter[key] = value.value
      }
    }

    await next()
  }
}
