import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env');
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: false
  });
  mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
  console.log('Connected to MongoDB');
  return mongoose;
}