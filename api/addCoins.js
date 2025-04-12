const { Pool } = require('pg');

// Строка подключения к вашей базе данных Neon
const connectionString = 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'Missing user_id' });
  }

  const client = await pool.connect();

  try {
    // Увеличиваем значение монет у пользователя
    const updateQuery = `
      INSERT INTO users (user_id, coins)
      VALUES ($1, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET coins = users.coins + 1
      RETURNING coins;
    `;

    const result = await client.query(updateQuery, [user_id]);
    const newCoins = result.rows[0].coins;

    return res.status(200).json({ success: true, coins: newCoins });

  } catch (error) {
    console.error('Ошибка в /api/addCoin:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
