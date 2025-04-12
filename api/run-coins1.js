const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = await pool.connect();

    try {
      // Код из coins1.js
      const result = await client.query(`
        INSERT INTO users (user_id, coins) 
        VALUES 
          (1001, 69),
          (1002, 100)
        RETURNING user_id, coins, created_at;
      `);

      return res.status(200).json({ success: true, result: result.rows });
    } catch (error) {
      console.error('Ошибка при выполнении запроса:', error);
      return res.status(500).json({ success: false, message: 'Ошибка при выполнении запроса' });
    } finally {
      client.release();
    }
  } else {
    return res.status(405).json({ success: false, message: 'Метод не разрешен' });
  }
}
