'use strict'

require('dotenv').config()

module.exports = {
  app: {
    port: 3000,
    baseUri: '/api'
  },
  mongodb: {
    url: process.env.MONGODB_URL,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS
  }
}
