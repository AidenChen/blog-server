require('dotenv').config()

module.exports = {
  default: process.env.DB_CONNECTION || 'mongo',
  connections: {
    mongo: {
      driver: 'mongo',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '27017',
      database: process.env.DB_DATABASE || 'forge',
      username: process.env.DB_USERNAME || 'forge',
      password: process.env.DB_PASSWORD || 'forge'
    }
  },
  redis: {
    enable: process.env.REDIS_ENABLE || false,
    host: process.env.REDIS_HOST || '127.0.0.1',
    password: process.env.REDIS_PASSWORD || null,
    port: process.env.REDIS_PORT || 6379,
    database: 0
  }
}
