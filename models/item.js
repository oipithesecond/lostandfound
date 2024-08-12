const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  itemType: String,
  building: String,
  specificArea: String,
  images: [{ filename: String, path: String, originalname: String }],
  uploadDate: {
    type:Date,
    default: Date.now,
    expires: '90d'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
})

const item = mongoose.model('item', itemSchema)
module.exports = item