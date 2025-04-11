const { Pool } = require('pg');

// 1. Подключение к Neon 
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false } // Обязательно для Neon!
});

// 2. Обработка запросов
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // Добавляем пользователя vlados с 52 монетами
    const result = await pool.query(
      'INSERT INTO users (user_id, coins) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET coins = $2 RETURNING coins',
      ['vlados', 52]
    );
    res.json({ coins: result.rows[0].coins });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
