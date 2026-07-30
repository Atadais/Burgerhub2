const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');
const { sendOrderNotification } = require('../bot');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/my/:phone', async (req, res) => {
  try {
    const orders = await db.getOrdersByPhone(req.params.phone);
    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders/my/:phone error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, name, phone, items, total, address, comment } = req.body;
    if (!name || !phone || !items) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const order = {
      id: Date.now(),
      type: type || 'delivery',
      name,
      phone,
      items,
      total: total || 0,
      address: address || '',
      comment: comment || '',
      status: 'processing',
      date: new Date().toISOString()
    };
    await db.createOrder(order);
    sendOrderNotification(order).catch(err => console.error('Bot notify error:', err.message));
    res.status(201).json({ success: true, id: order.id });
  } catch (err) {
    console.error('POST /api/orders error:', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);
    if (!status || !['processing', 'accepted', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await db.updateOrderStatus(orderId, status);
    res.json({ success: true });
  } catch (err) {
    console.error('PUT /api/orders/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;