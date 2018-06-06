require('dotenv').config()

module.exports = {
  enable: process.env.SSL_ENABLE || false,
  key: process.env.SSL_KEY || '',
  pem: process.env.SSL_PEM || '',
}
