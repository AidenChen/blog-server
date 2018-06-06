const Kamora = require('kamora')
const moment = require('moment')

const Schema = Kamora.Database.Schema

const userSchema = new Schema({
  username: String,
  password: String,
  nick: String,
  avatar: String,
  registered_at: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
  },
  logged_in_at: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
  }
}, { versionKey: false })

userSchema.pre('save', function (next) {
  const time = Date.now()
  if (this.isNew) {
    this.registered_at = time
    this.logged_in_at = time
  }
  next()
})

userSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
    delete ret.password
  }
})

module.exports = Kamora.Database.model('user', userSchema)
