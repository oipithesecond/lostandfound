const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to database!');
  } catch (error) {
    console.error('Failed to connect to database', error);
  }
}

module.exports = connectDB