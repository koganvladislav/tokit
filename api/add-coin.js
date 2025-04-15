// add-coins.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

async function getCoinsFromDB(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT coins FROM users WHERE user_id = $1', 
      [userId]
    );
    return result.rows[0]?.coins || 0;
  } finally {
    client.release();
  }
}

module.exports = { getCoinsFromDB };
