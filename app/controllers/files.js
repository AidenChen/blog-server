const fs = require('fs')
const Kamora = require('kamora')
const qiniu = require('qiniu')
const authenticate = require('../middleware/authenticate')
const qiniuConfig = require('../../config/qiniu')

const router = new Kamora.Router()

function parseFile(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let chunks = []
      let size
      let bufferconcat
      ctx.req.on('data', function(chunk) {
        chunks.push(chunk)
        size = chunk.length
      })
      let newArray = []
      ctx.req.on('end', function() {
        bufferconcat = Buffer.concat(chunks, size)
        for(let a = 0; a < bufferconcat.length; a++) {
          if (bufferconcat[a].toString() == 13 && bufferconcat[a + 1].toString() == 10) {
            newArray.push(a)
          }
        }

        let name = bufferconcat.slice(newArray[0], newArray[1]).toString().split(';')[2].split('=')[1]
        let filename = name.split('\"')
        filename = new Date().getTime() + '.' + filename[1].split('.')[1]
        let data = bufferconcat.slice(newArray[3] + 2, newArray[newArray.length - 2])
        fs.writeFileSync('uploads/' + filename, data)
        resolve(filename)
      })
    } catch (error) {
      reject(error)
    }
  })
}

function uploadFile(uploadToken, filename) {
  return new Promise((resolve, reject) => {
    const config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z0
    config.useCdnDomain = true
    const formUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    const readableStream = fs.createReadStream('uploads/' + filename)
    formUploader.putStream(uploadToken, `blog/${filename}`, readableStream, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        console.log(respErr)
        reject(respErr)
        return
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody)
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
        reject(respBody)
      }
    })
  })
}

router.push({
  method: 'post',
  path: '/',
  processors: [
    authenticate,
    async (ctx, next) => {
      // 生成鉴权对象
      const mac = new qiniu.auth.digest.Mac(qiniuConfig.accessKey, qiniuConfig.secretKey)
      // 生成上传凭证
      const options = {
        scope: qiniuConfig.bucket,
        expires: 7200,
        returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
      }
      const putPolicy = new qiniu.rs.PutPolicy(options)
      // 生成token
      const uploadToken = putPolicy.uploadToken(mac)
      // 将请求数据保存本地文件
      const filename = await parseFile(ctx)
      // 上传
      const res = await uploadFile(uploadToken, filename)

      ctx.body = {
        path: `${qiniuConfig.domain}${res.key}`
      }

      await next()
    }
  ]
})

module.exports = router
