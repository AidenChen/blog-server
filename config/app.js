require('dotenv').config()

const log = require('../app/middleware/log')
const formatResponse = require('../app/middleware/format_response')
const crossDomain = require('../app/middleware/cross_domain')

module.exports = {
  port: process.env.APP_PORT || '3000',
  middleware: [log, formatResponse, crossDomain]
}
