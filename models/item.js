const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/itemmodel')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database!');
});
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  itemType: String,
  building: String,
  specificArea: String,
  images: [{ filename: String, path: String, originalname: String }],
})

module.exports = mongoose.model('item', itemSchema)