const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { password } = req.body;
  const expected = process.env.ADMIN_PASSWORD || 'Burgerhub_admin88';
  if (password === expected) {
    res.json({ success: true, token: password });
  } else {
    res.status(401).json({ success: false, error: 'Неверный пароль' });
  }
});

function createTransporter() {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@mail.ru') {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mail.ru',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// User register
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!phone || !email || !password) {
      return res.status(400).json({ error: 'Телефон, email и пароль обязательны' });
    }

    const existingPhone = await db.findUserByPhone(phone);
    if (existingPhone) {
      return res.status(409).json({ error: 'Телефон уже зарегистрирован' });
    }
    const existingEmail = await db.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email уже зарегистрирован' });
    }

    const user = await db.createUser(phone, email, hashPassword(password), name || '');

    const transporter = createTransporter();
    if (transporter) {
      const code = generateCode();
      await db.saveVerificationCode(email, code);
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Код подтверждения BURGERHUB',
        html: `<div style="font-family:Arial;max-width:400px;margin:0 auto;padding:20px;background:#1C1C20;color:#F0EDE8;border-radius:12px;border:1px solid rgba(212,162,78,0.25)">
          <div style="text-align:center;margin-bottom:20px">
            <div style="width:48px;height:48px;background:linear-gradient(135deg,#D4A24E,#C89430);border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;color:#0C0C0E;margin:0 auto 12px">BH</div>
            <div style="font-size:18px;font-weight:700">BURGER<span style="color:#D4A24E">HUB</span></div>
          </div>
          <div style="font-size:14px;color:#9C9690;margin-bottom:16px">Ваш код подтверждения:</div>
          <div style="font-size:36px;font-weight:800;color:#D4A24E;text-align:center;letter-spacing:8px;margin:16px 0;padding:16px;background:#121214;border-radius:12px;border:1px solid rgba(255,255,255,0.06)">${code}</div>
          <div style="font-size:12px;color:#6B6662;text-align:center">Код действителен 10 минут</div>
        </div>`
      });
    }

    res.json({ success: true, message: 'Код подтверждения отправлен на email', userId: user.id });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Телефон или email уже зарегистрирован' });
    }
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email и код обязательны' });
    }

    const valid = await db.verifyCode(email, code);
    if (!valid) {
      return res.status(400).json({ error: 'Неверный или истёкший код' });
    }

    await db.verifyUser(email);
    const user = await db.findUserByEmail(email);

    res.json({ success: true, message: 'Email подтверждён', userId: user.id, phone: user.phone });
  } catch (err) {
    console.error('Verify email error:', err.message);
    res.status(500).json({ error: 'Ошибка подтверждения' });
  }
});

// Resend verification code
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email обязателен' });

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(400).json({ error: 'SMTP не настроен' });
    }

    const code = generateCode();
    await db.saveVerificationCode(email, code);
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Код подтверждения BURGERHUB',
      html: `<div style="font-family:Arial;max-width:400px;margin:0 auto;padding:20px;background:#1C1C20;color:#F0EDE8;border-radius:12px;border:1px solid rgba(212,162,78,0.25)">
        <div style="font-size:36px;font-weight:800;color:#D4A24E;text-align:center;letter-spacing:8px;margin:16px 0;padding:16px;background:#121214;border-radius:12px;border:1px solid rgba(255,255,255,0.06)">${code}</div>
        <div style="font-size:12px;color:#6B6662;text-align:center">Код действителен 10 минут</div>
      </div>`
    });

    res.json({ success: true, message: 'Код отправлен' });
  } catch (err) {
    console.error('Send verification error:', err.message);
    res.status(500).json({ error: 'Ошибка отправки кода' });
  }
});

// User login by phone + password
router.post('/user-login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Телефон и пароль обязательны' });
    }

    const user = await db.findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({ error: 'Неверный телефон или пароль' });
    }

    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ error: 'Неверный телефон или пароль' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Email не подтверждён', needsVerification: true, email: user.email });
    }

    res.json({ success: true, user: { id: user.id, phone: user.phone, email: user.email, name: user.name } });
  } catch (err) {
    console.error('User login error:', err.message);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

module.exports = router;