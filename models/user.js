// const mongoose = require('mongoose')

// const userSchema = mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     posts: [
//         {type: mongoose.Schema.Types.ObjectId,
//          ref: 'item',
//         }
//     ],
//   })

//   const user = mongoose.model('user', userSchema)
//   module.exports = user

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // name: String,
    // password: String, 
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