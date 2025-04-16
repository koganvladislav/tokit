// api/addCoin.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const userId = 1001;

    await pool.query(`
      UPDATE users
      SET coins = coins + 1
      WHERE user_id = $1
    `, [userId]);

    res.status(200).json({ message: 'Coin added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
