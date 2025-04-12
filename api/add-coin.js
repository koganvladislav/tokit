const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({
  connectionString: connectionString,
  max: 20, // максимальное количество клиентов в пуле
  idleTimeoutMillis: 30000, // время простоя перед закрытием
  connectionTimeoutMillis: 2000, // время ожидания подключения
});

// Функция для обновления монет
async function updateCoins(userId, coinsToAdd) {
  const client = await pool.connect();
  
  try {
    console.log('Подключение к базе данных установлено');

    // Начисление монет и обновление записи
    const result = await client.query(`
      WITH updated AS (
        UPDATE users 
        SET coins = coins + $1 
        WHERE user_id = $2 
        RETURNING user_id, coins
      )
      DELETE FROM users 
      WHERE created_at < (SELECT MIN(created_at) FROM updated)
      RETURNING user_id, coins;
    `, [coinsToAdd, userId]);

    console.log('Монеты обновлены для пользователя:', result.rows);
    
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  } finally {
    client.release();
  }
}
