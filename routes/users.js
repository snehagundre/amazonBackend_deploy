import express from 'express';
import User from '../models/user.model.js';
import { jwt, JWT_SECRET } from '../config/jwt.js';

const router = express.Router();

// Check if account exists by email or mobile (for forgot password)
router.post('/check-account', async (req, res) => {
  const { emailOrMobile } = req.body;
  try {
    const user = await User.findOne({ $or: [ { email: emailOrMobile }, { mobile: emailOrMobile } ] });
    if (user) {
      res.json({ exists: true });
      // Here you would send a reset link to the user's email in a real app
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Simple login route (now with JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ success: false, error: 'User not found' });
    } else if (user.password !== password) {
      res.json({ success: false, error: 'Invalid password' });
    } else {
      // Generate JWT token
      const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      // Attach token to user object (do not send password)
      const userObj = user.toObject();
      delete userObj.password;
      userObj.token = token;
      res.json({ success: true, user: userObj });
    }
  } catch (err) {
    res.json({ success: false, error: 'Server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;
    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Email pattern validation

    // Mobile pattern validation (10 digits)
    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({ error: 'Invalid mobile number. Must be 10 digits.' });
    }

    // Password pattern validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters, include upper and lower case letters, a number, and a special symbol.' });
    }

    // Check if user already exists (by email or mobile)
    const existingUser = await User.findOne({ $or: [ { email }, { mobile } ] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or mobile already exists.' });
    }

    const user = new User({ firstName, lastName, email, mobile, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
