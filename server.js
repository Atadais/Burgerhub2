require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { initBot } = require('./bot');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/user', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function start() {
  try {
    await db.initDB();
    initBot();
    app.listen(PORT, () => {
      console.log('BURGERHUB server running on port ' + PORT);
    });
  } catch (err) {
    console.error('Failed to start server:');
    console.error(JSON.stringify({ message: err.message, code: err.code, stack: err.stack }, null, 2));
    setTimeout(() => process.exit(1), 1000);
  }
}

start();