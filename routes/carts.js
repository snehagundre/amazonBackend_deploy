import express from 'express';
import Cart from '../models/cart.model.js';

const router = express.Router();

// Upsert (add or update) a single cart item for a user
router.post('/user/:userId/item', async (req, res) => {
  try {
    const { product, qty } = req.body;
    if (!product || !qty || qty < 1) {
      return res.status(400).json({ error: 'Product and qty are required, qty must be >= 1.' });
    }
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [{ product, qty }] });
    } else {
      const itemIndex = cart.items.findIndex(i => i.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ product, qty });
      }
      cart.updatedAt = Date.now();
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get cart for user
router.get('/user/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update or create cart for user
router.post('/user/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      cart.items = req.body.items;
      cart.updatedAt = Date.now();
      await cart.save();
    } else {
      cart = new Cart({ userId: req.params.userId, items: req.body.items });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
