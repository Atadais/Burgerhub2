const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false }
    : false
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id VARCHAR(20) PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        price2 INTEGER DEFAULT NULL,
        ingredients TEXT DEFAULT '',
        image TEXT DEFAULT ''
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY,
        type VARCHAR(20) NOT NULL DEFAULT 'delivery',
        name TEXT NOT NULL,
        phone VARCHAR(30) NOT NULL,
        items TEXT NOT NULL,
        total INTEGER NOT NULL DEFAULT 0,
        address TEXT DEFAULT '',
        comment TEXT DEFAULT '',
        status VARCHAR(20) NOT NULL DEFAULT 'processing',
        date TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) DEFAULT '',
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    console.log('Database tables initialized');
  } finally {
    client.release();
  }
}

async function getMenu() {
  const { rows } = await pool.query('SELECT * FROM menu ORDER BY category, id');
  const grouped = {};
  for (const item of rows) {
    if (!grouped[item.category]) grouped[item.category] = [];
    const { category, ...data } = item;
    grouped[item.category].push(data);
  }
  return grouped;
}

async function seedMenu(data) {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM menu');
    for (const [category, items] of Object.entries(data)) {
      for (const item of items) {
        await client.query(
          'INSERT INTO menu (id, category, name, price, price2, ingredients, image) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET name=$3, price=$4, price2=$5, ingredients=$6, image=$7',
          [item.id, category, item.name, item.price, item.price2 || null, item.ingredients || '', item.image || '']
        );
      }
    }
    console.log('Menu seeded');
  } finally {
    client.release();
  }
}

async function getOrders() {
  const { rows } = await pool.query('SELECT * FROM orders ORDER BY date DESC');
  return rows;
}

async function getOrdersByPhone(phone) {
  const { rows } = await pool.query('SELECT * FROM orders WHERE phone = $1 ORDER BY date DESC', [phone]);
  return rows;
}

async function createOrder(order) {
  await pool.query(
    'INSERT INTO orders (id, type, name, phone, items, total, address, comment, status, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    [order.id, order.type, order.name, order.phone, order.items, order.total, order.address || '', order.comment || '', order.status || 'processing', order.date || new Date().toISOString()]
  );
}

async function updateOrderStatus(id, status) {
  await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
}

async function getOrderById(id) {
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  return rows[0] || null;
}

async function createUser(phone, email, password, name) {
  const { rows } = await pool.query(
    'INSERT INTO users (phone, email, password, name) VALUES ($1,$2,$3,$4) RETURNING id, phone, email, name, verified, created_at',
    [phone, email, password, name || '']
  );
  return rows[0];
}

async function findUserByPhone(phone) {
  const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return rows[0] || null;
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const { rows } = await pool.query('SELECT id, phone, email, name, verified, created_at FROM users WHERE id = $1', [id]);
  return rows[0] || null;
}

async function verifyUser(email) {
  await pool.query('UPDATE users SET verified = true WHERE email = $1', [email]);
}

async function updateUserProfile(id, data) {
  const sets = [];
  const vals = [];
  let i = 1;
  if (data.name !== undefined) { sets.push(`name = $${i++}`); vals.push(data.name); }
  if (data.phone !== undefined) { sets.push(`phone = $${i++}`); vals.push(data.phone); }
  if (data.email !== undefined) { sets.push(`email = $${i++}`); vals.push(data.email); }
  if (data.password !== undefined) { sets.push(`password = $${i++}`); vals.push(data.password); }
  if (sets.length === 0) return null;
  vals.push(id);
  const { rows } = await pool.query(
    `UPDATE users SET ${sets.join(', ')} WHERE id = $${i} RETURNING id, phone, email, name, verified, created_at`,
    vals
  );
  return rows[0] || null;
}

async function saveVerificationCode(email, code) {
  await pool.query(
    'INSERT INTO verification_codes (email, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'10 minutes\')',
    [email, code]
  );
}

async function verifyCode(email, code) {
  const { rows } = await pool.query(
    'SELECT id FROM verification_codes WHERE email = $1 AND code = $2 AND expires_at > NOW() AND used = false ORDER BY id DESC LIMIT 1',
    [email, code]
  );
  if (rows.length === 0) return false;
  await pool.query('UPDATE verification_codes SET used = true WHERE id = $1', [rows[0].id]);
  return true;
}

module.exports = { pool, initDB, getMenu, seedMenu, getOrders, getOrdersByPhone, createOrder, updateOrderStatus, getOrderById, createUser, findUserByPhone, findUserByEmail, findUserById, verifyUser, updateUserProfile, saveVerificationCode, verifyCode };