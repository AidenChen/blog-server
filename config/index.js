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
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: 60
  },
  admin: {
  	username: process.env.ADMIN_USERNAME,
  	password: process.env.ADMIN_PASSWORD
  }
}
