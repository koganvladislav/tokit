const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS (можно ограничить origin при необходимости)
app.use(cors());

// Подключение к PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Эндпоинт: Получить количество монет
app.get('/api/get-coins', async (req, res) => {
  const userId = parseInt(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  try {
    const result = await pool.query('SELECT coins FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      // Если пользователь не найден — создать с 0 монетами
      await pool.query('INSERT INTO users (user_id, coins) VALUES ($1, 0)', [userId]);
      return res.json({ coins: 0 });
    }

    res.json({ coins: result.rows[0].coins });
  } catch (error) {
    console.error('Ошибка при получении монет:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Эндпоинт: Добавить 1 монету
app.get('/api/add-coin', async (req, res) => {
  const userId = parseInt(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  try {
    const result = await pool.query('SELECT coins FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      await pool.query('INSERT INTO users (user_id, coins) VALUES ($1, 1)', [userId]);
      return res.json({ coins: 1 });
    } else {
      const newCoins = result.rows[0].coins + 1;
      await pool.query('UPDATE users SET coins = $1 WHERE user_id = $2', [newCoins, userId]);
      return res.json({ coins: newCoins });
    }
  } catch (error) {
    console.error('Ошибка при добавлении монеты:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
