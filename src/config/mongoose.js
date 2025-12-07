const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

const connectMongoose = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectMongoose;