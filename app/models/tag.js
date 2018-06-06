const Kamora = require('kamora')

const Schema = Kamora.Database.Schema

const tagSchema = new Schema({
  name: {
    type: String,
    default: ''
  }
}, { versionKey: false })

tagSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: (doc, ret, options) => {
    ret.id = ret._id
    delete ret._id
  }
})

module.exports = Kamora.Database.model('tag', tagSchema)
