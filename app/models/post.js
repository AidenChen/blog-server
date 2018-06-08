const Kamora = require('kamora')
const moment = require('moment')

const Schema = Kamora.Database.Schema

const postSchema = new Schema({
  title: String,
  content: String,
  abstract: String,
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'tag'
  }],
  is_published: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY/MM/DD')
  },
  updated_at: {
    type: Date,
    default: Date.now(),
    get: v => moment(v).format('YYYY/MM/DD')
  }
}, { versionKey: false })

postSchema.pre('save', function (next) {
  const time = Date.now()
  if (this.isNew) {
    this.created_at = time
  }
  this.updated_at = time
  next()
})

postSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Kamora.Database.model('post', postSchema)
