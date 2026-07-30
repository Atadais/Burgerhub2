const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

function userAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = parseInt(userId);
  next();
}

router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', userAuth, async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password = hashPassword(password);
    const user = await db.updateUserProfile(req.userId, data);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders', userAuth, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const orders = await db.getOrdersByPhone(user.phone);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;