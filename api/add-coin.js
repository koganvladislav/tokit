const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    const client = await pool.connect();
    try {
        // Обновляем количество монет для пользователя
        const result = await client.query(`
            UPDATE users
            SET coins = coins + 1
            WHERE user_id = $1
            RETURNING coins;
        `, [userId]);

        if (result.rows.length > 0) {
            return res.json({ coins: result.rows[0].coins });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении монет:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};
