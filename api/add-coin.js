import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId не указан' });
  }

  try {
    const result = await pool.query('SELECT coins FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.status(200).json({ coins: result.rows[0].coins });
    } else {
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Ошибка запроса к базе:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
