const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =  process.env.MONGO_URI; 

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('connected successfully');
  } catch (error) {
    console.error('error with connecting with the DB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;