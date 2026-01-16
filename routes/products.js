import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const products = await Product.find().skip(skip).limit(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get total product count
router.get('/count', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json(count);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ $or: [{ _id: id }, { asin: id }] });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;