const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/foundit')
    console.log('Connected to database!');
  } catch (error) {
    console.error('Failed to connect to database', error);
  }
}

module.exports = connectDB