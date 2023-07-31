import mongoose from 'mongoose';

// MONGO_URI=mongodb://127.0.0.1:27017/

const MONGO_URI = 'mongodb://127.0.0.1:27017/placeapp';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
