// /api/addCoin.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  try {
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    await pool.query(`
      INSERT INTO users (user_id, coins, created_at)
      VALUES ($1, 1, NOW())
      ON CONFLICT (user_id) DO UPDATE SET coins = users.coins + 1
    `, [user_id]);

    res.status(200).json({ message: 'Coin added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
};
