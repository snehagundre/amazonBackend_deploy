import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  label: { type: String, required: true },
  details: { type: String, required: true }
});

export default mongoose.model('Address', addressSchema);
