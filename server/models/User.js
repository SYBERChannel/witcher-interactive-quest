const pool = require("../config/db");

const User = {
    async create(username, email, passwordHash) {
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at`,
            [username, email, passwordHash]
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await pool.query(
            `SELECT id, username, email, password_hash, refresh_token, created_at
       FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0] || null;
    },

    async findByUsername(username) {
        const result = await pool.query(
            `SELECT id, username, email, password_hash, refresh_token, created_at
       FROM users WHERE username = $1`,
            [username]
        );
        return result.rows[0] || null;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT id, username, email, created_at
       FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    async updateRefreshToken(userId, hashedToken) {
        await pool.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [hashedToken, userId]
        );
    },

    async clearRefreshToken(userId) {
        await pool.query(
            `UPDATE users SET refresh_token = NULL WHERE id = $1`,
            [userId]
        );
    },

    async findByRefreshToken(hashedToken) {
        const result = await pool.query(
            `SELECT id, username, email, refresh_token, created_at
       FROM users WHERE refresh_token = $1`,
            [hashedToken]
        );
        return result.rows[0] || null;
    },
};

module.exports = User;
