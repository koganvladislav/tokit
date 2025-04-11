DATABASE_URL='postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'

const { Pool } = require('pg');
const crypto = require('crypto');

// 1. Подключение к Neon 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Берётся из переменных Vercel
  ssl: { rejectUnauthorized: false } // Обязательно для Neon!
});

// 2. Проверка данных от Telegram
function validateTelegramData(initData) {
  const botToken = process.env.BOT_TOKEN;
  const data = new URLSearchParams(initData);
  const hash = data.get('hash');
  const items = Array.from(data.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secret).update(items).digest('hex');
  return hash === calculatedHash;
}

// 3. Обработка запросов
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { initData, amount } = req.body;

  // Проверяем данные пользователя
  if (!validateTelegramData(initData)) {
    return res.status(403).json({ error: 'Invalid Telegram data' });
  }

  // Извлекаем user_id из данных Telegram
  const tgData = new URLSearchParams(initData);
  const userId = tgData.get('user.id');

  try {
    if (amount !== undefined) {
      // Добавляем монетки
      const result = await pool.query(
        'UPDATE users SET coins = coins + $1 WHERE user_id = $2 RETURNING coins',
        [amount, userId]
      );
      res.json({ coins: result.rows[0].coins });
    } else {
      // Получаем текущий баланс
      const result = await pool.query(
        'INSERT INTO users (user_id, coins) VALUES ($1, 0) ON CONFLICT (user_id) DO UPDATE SET coins = users.coins RETURNING coins',
        [userId]
      );
      res.json({ coins: result.rows[0].coins });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
