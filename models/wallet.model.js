import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  balance: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Wallet', walletSchema);
