// /api/addCoins.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { user_id, coins } = req.body;

  if (!user_id || typeof coins !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO users (user_id, coins) 
      VALUES 
        (1001, 5),
        (1002, 100)
      RETURNING user_id, coins, created_at;
    `);
    res.status(200).json({ message: 'Coins updated', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
