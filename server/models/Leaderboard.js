const pool = require("../config/db");

const Leaderboard = {
    async submit(userId, totalXp, level, branch, scenesVisited, battlesWon) {
        const result = await pool.query(
            `INSERT INTO leaderboard (user_id, total_xp, level, branch, scenes_visited, battles_won)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [userId, totalXp, level, branch, scenesVisited, battlesWon]
        );
        return result.rows[0];
    },

    async getTop(limit = 100) {
        const result = await pool.query(
            `SELECT l.id, l.total_xp, l.level, l.branch, l.scenes_visited, l.battles_won, l.completed_at,
              u.username
       FROM leaderboard l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.total_xp DESC
       LIMIT $1`,
            [limit]
        );
        return result.rows;
    },

    async getUserRank(userId) {
        const result = await pool.query(
            `SELECT rank FROM (
         SELECT user_id, RANK() OVER (ORDER BY total_xp DESC) as rank
         FROM leaderboard
       ) ranked WHERE user_id = $1
       LIMIT 1`,
            [userId]
        );
        return result.rows[0] ? parseInt(result.rows[0].rank, 10) : null;
    },
};

module.exports = Leaderboard;
