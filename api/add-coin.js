import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_oDfBsJ7Wad4k@ep-ancient-fire-ab1mjrmu-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require'
});

export default async function handler(req, res) {
    // Включаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const userId = req.query.userId;

    if (!userId) {
        console.error('userId не указан');
        return res.status(400).json({ error: 'userId не указан' });
    }

    try {
        console.log(`Запрос монет для пользователя ${userId}`); // Логирование
        const result = await pool.query('SELECT coins FROM users WHERE id = $1', [userId]);
        
        if (result.rows.length === 0) {
            console.error(`Пользователь ${userId} не найден`);
            return res.status(404).json({ error: 'Пользователь не найден' });
        }

        const coins = result.rows[0].coins;
        console.log(`Найдено ${coins} монет для пользователя ${userId}`); // Логирование
        return res.status(200).json({ coins });
        
    } catch (error) {
        console.error('Ошибка базы данных:', error);
        return res.status(500).json({ 
            error: 'Ошибка сервера',
            details: error.message 
        });
    }
}
