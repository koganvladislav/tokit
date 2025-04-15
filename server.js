require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

// Создание таблицы при запуске (если не существует)
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        coins INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Получить количество монет
app.get('/api/coins/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT coins FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      // Создаем пользователя, если не существует
      await pool.query('INSERT INTO users (id, coins) VALUES ($1, 0)', [userId]);
      return res.json({ coins: 0 });
    }
    
    res.json({ coins: result.rows[0].coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновить количество монет
app.post('/api/coins/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { coins } = req.body;
    
    await pool.query(`
      INSERT INTO users (id, coins) 
      VALUES ($1, $2)
      ON CONFLICT (id) 
      DO UPDATE SET coins = EXCLUDED.coins
    `, [userId, coins]);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получить или создать пользователя
app.post('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      INSERT INTO users (id) 
      VALUES ($1)
      ON CONFLICT (id) 
      DO UPDATE SET id = EXCLUDED.id
      RETURNING coins
    `, [userId]);
    
    res.json({ coins: result.rows[0].coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Server running on port ${PORT}`);
});
