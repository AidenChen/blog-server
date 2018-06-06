const path = require('path')

// 日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')
// 错误日志目录
const errorPath = '/error'
// 错误日志文件名
const errorFileName = 'error'
// 错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName
// 接口日志目录
const apiPath = '/api'
// 接口日志文件名
const apiFileName = 'api'
// 接口日志输出完整路径
const apiLogPath = baseLogPath + apiPath + '/' + apiFileName

module.exports = {
  appenders: {
    out: {
      type: 'console'
    },
    errorLogger: {
      type: 'dateFile',
      filename: errorLogPath,
      encoding: 'utf-8',
      maxLogSize: 2000000,
      numBackups: 5,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      path: errorPath
    },
    apiLogger: {
      type: 'dateFile',
      filename: apiLogPath,
      encoding: 'utf-8',
      maxLogSize: 2000000,
      numBackups: 5,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      path: apiPath
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    },
    errorLogger: {
      appenders: ['errorLogger'],
      level: 'error'
    },
    apiLogger: {
      appenders: ['apiLogger'],
      level: 'info'
    }
  }
}
