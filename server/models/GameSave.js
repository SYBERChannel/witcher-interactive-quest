const pool = require("../config/db");

const GameSave = {
    async create(userId) {
        const result = await pool.query(
            `INSERT INTO game_saves (user_id, current_scene_id, branch, flags, hp, max_hp, xp, level, gold, battle_count, choices_made)
       VALUES ($1, 'prologue_01', 'neutral', '{}', 100, 100, 0, 1, 50, 0, '[]')
       RETURNING *`,
            [userId]
        );
        return result.rows[0];
    },

    async findByUserId(userId) {
        const result = await pool.query(
            `SELECT * FROM game_saves WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
            [userId]
        );
        return result.rows[0] || null;
    },

    async findById(id) {
        const result = await pool.query(
            `SELECT * FROM game_saves WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    },

    async update(id, fields) {
        const {
            current_scene_id,
            branch,
            flags,
            hp,
            max_hp,
            xp,
            level,
            gold,
            battle_count,
            choices_made,
        } = fields;

        const result = await pool.query(
            `UPDATE game_saves
       SET current_scene_id = $1,
           branch = $2,
           flags = $3,
           hp = $4,
           max_hp = $5,
           xp = $6,
           level = $7,
           gold = $8,
           battle_count = $9,
           choices_made = $10
       WHERE id = $11
       RETURNING *`,
            [
                current_scene_id,
                branch,
                JSON.stringify(flags),
                hp,
                max_hp,
                xp,
                level,
                gold,
                battle_count,
                JSON.stringify(choices_made),
                id,
            ]
        );
        return result.rows[0];
    },

    async updateScene(id, sceneId, choiceId, choicesMade) {
        const result = await pool.query(
            `UPDATE game_saves
       SET current_scene_id = $1, choices_made = $2
       WHERE id = $3
       RETURNING *`,
            [sceneId, JSON.stringify(choicesMade), id]
        );
        return result.rows[0];
    },

    async updateBranch(id, branch) {
        const result = await pool.query(
            `UPDATE game_saves SET branch = $1 WHERE id = $2 RETURNING *`,
            [branch, id]
        );
        return result.rows[0];
    },

    async updateFlags(id, flags) {
        const result = await pool.query(
            `UPDATE game_saves SET flags = $1 WHERE id = $2 RETURNING *`,
            [JSON.stringify(flags), id]
        );
        return result.rows[0];
    },

    async updateHp(id, hp) {
        const result = await pool.query(
            `UPDATE game_saves SET hp = $1 WHERE id = $2 RETURNING *`,
            [hp, id]
        );
        return result.rows[0];
    },

    async updateXp(id, xp, level) {
        const result = await pool.query(
            `UPDATE game_saves SET xp = $1, level = $2 WHERE id = $3 RETURNING *`,
            [xp, level, id]
        );
        return result.rows[0];
    },

    async updateGold(id, gold) {
        const result = await pool.query(
            `UPDATE game_saves SET gold = $1 WHERE id = $2 RETURNING *`,
            [gold, id]
        );
        return result.rows[0];
    },

    async incrementBattleCount(id) {
        const result = await pool.query(
            `UPDATE game_saves SET battle_count = battle_count + 1 WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    },

    async delete(id) {
        await pool.query(`DELETE FROM game_saves WHERE id = $1`, [id]);
    },
};

module.exports = GameSave;
