import express from 'express';
import Wallet from '../models/wallet.model.js';

const router = express.Router();

// Get wallet for user
router.get('/user/:userId', async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update wallet balance for user
router.post('/user/:userId', async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });
    if (wallet) {
      wallet.balance = req.body.balance;
      wallet.updatedAt = Date.now();
      await wallet.save();
    } else {
      wallet = new Wallet({ userId: req.params.userId, balance: req.body.balance });
      await wallet.save();
    }
    res.json(wallet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
