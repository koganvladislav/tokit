// /api/coins.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
});

module.exports = async (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (!userId) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT coins FROM users WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      // если нет юзера — создать
      await pool.query(
        'INSERT INTO users (user_id, coins, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())',
        [userId, 0]
      );
      return res.status(200).json({ coins: 0 });
    }

    res.status(200).json({ coins: rows[0].coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};
