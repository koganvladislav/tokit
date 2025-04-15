const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require',
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT coins FROM users WHERE user_id = $1', [1001]);
    const coins = result.rows[0]?.coins ?? null;
    res.status(200).json({ coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};
