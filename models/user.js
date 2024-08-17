const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email:{
type:String,
required: true,
  },
      posts: [
        {type: mongoose.Schema.Types.ObjectId,
         ref: 'item',
        }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('user', userSchema)