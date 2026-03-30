const pool = require("../config/db");

const BattleLog = {
    async create(gameSaveId, battleId, enemyName, rounds, result, xpGained, loot) {
        const row = await pool.query(
            `INSERT INTO battle_logs (game_save_id, battle_id, enemy_name, rounds, result, xp_gained, loot)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [
                gameSaveId,
                battleId,
                enemyName,
                JSON.stringify(rounds),
                result,
                xpGained,
                JSON.stringify(loot),
            ]
        );
        return row.rows[0];
    },

    async findByGameSaveId(gameSaveId) {
        const result = await pool.query(
            `SELECT * FROM battle_logs WHERE game_save_id = $1 ORDER BY fought_at DESC`,
            [gameSaveId]
        );
        return result.rows;
    },

    async findByBattleId(gameSaveId, battleId) {
        const result = await pool.query(
            `SELECT * FROM battle_logs WHERE game_save_id = $1 AND battle_id = $2`,
            [gameSaveId, battleId]
        );
        return result.rows[0] || null;
    },

    async countWonByGameSave(gameSaveId) {
        const result = await pool.query(
            `SELECT COUNT(*) as count FROM battle_logs WHERE game_save_id = $1 AND result = 'won'`,
            [gameSaveId]
        );
        return parseInt(result.rows[0].count, 10);
    },
};

module.exports = BattleLog;
