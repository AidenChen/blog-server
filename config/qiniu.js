require('dotenv').config()

module.exports = {
  accessKey: process.env.QINIU_ACCESS_KEY || '',
  secretKey: process.env.QINIU_SECRET_KEY || '',
  bucket: process.env.QINIU_BUCKET || '',
  domain: process.env.QINIU_DOMAIN || ''
}
