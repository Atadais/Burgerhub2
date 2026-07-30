const TelegramBot = require('node-telegram-bot-api');

let bot = null;
let adminId = null;

function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  adminId = process.env.ADMIN_TELEGRAM_ID;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN not set, bot disabled');
    return;
  }

  bot = new TelegramBot(token, { polling: true });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
      bot.sendMessage(chatId,
        'Привет! Я бот BURGERHUB 🍔\n\n'
        + 'Я буду присылать уведомления о новых заказах.\n'
        + `Твой ID: ${chatId}`
      );
    }
  });

  console.log('Telegram bot initialized');
}

async function sendOrderNotification(order) {
  if (!bot || !adminId) return;

  const typeLabel = order.type === 'delivery' ? 'Доставка' : 'Самовывоз';

  let message = 'Новый заказ! #' + String(order.id).slice(-6) + '\n';
  message += '━━━━━━━━━━━━━━━\n';
  message += 'Клиент: ' + order.name + '\n';
  message += 'Телефон: ' + order.phone + '\n';
  message += 'Тип: ' + typeLabel + '\n';

  if (order.address) {
    message += 'Адрес: ' + order.address + '\n';
  }

  message += '━━━━━━━━━━━━━━━\n';
  message += 'Состав заказа:\n' + order.items + '\n';
  message += '━━━━━━━━━━━━━━━\n';
  message += 'Сумма: ' + order.total + ' ₽';

  try {
    await bot.sendMessage(adminId, message);
  } catch (err) {
    console.error('Failed to send Telegram notification:', err.message);
  }
}

function getBot() {
  return bot;
}

module.exports = { initBot, sendOrderNotification, getBot };