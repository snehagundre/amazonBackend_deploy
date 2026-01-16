import express from 'express';
import Address from '../models/address.model.js';

const router = express.Router();

// Get all addresses for user
router.get('/user/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new address for user
router.post('/user/:userId', async (req, res) => {
  try {
    const address = new Address({ userId: req.params.userId, ...req.body });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
