const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For quick setup, using a simple connection string
    // Replace with your MongoDB connection string
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://abhimongodb:Abhinay%40mongodb@formbuilder.5mykxcf.mongodb.net/?retryWrites=true&w=majority&appName=formBuilder';
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without database connection for development...');
    // Don't exit - allow server to start without DB for image uploads
  }
};

module.exports = connectDB;