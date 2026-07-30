const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const menu = await db.getMenu();
    res.json(menu);
  } catch (err) {
    console.error('GET /api/menu error:', err.message);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

module.exports = router;