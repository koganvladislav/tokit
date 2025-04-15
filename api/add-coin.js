// server.js
const express = require('express');
const { Pool } = require('pg');
const app = express();

// Подключение к PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

// Endpoint для получения монет
app.get('/api/add-coin', async (req, res) => {
  try {
    const userId = req.query.userId;
    const result = await pool.query(
      'SELECT coins FROM users WHERE user_id = $1', 
      [userId]
    );
    
    if (result.rows.length > 0) {
      res.json({ coins: result.rows[0].coins });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
