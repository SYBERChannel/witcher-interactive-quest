const pool = require("../config/db");

const Inventory = {
    async addItem(gameSaveId, itemId, itemType, name, stats, equipped, quantity) {
        const existing = await pool.query(
            `SELECT id, quantity FROM inventories
       WHERE game_save_id = $1 AND item_id = $2`,
            [gameSaveId, itemId]
        );

        if (existing.rows.length > 0 && (itemType === "potion")) {
            const result = await pool.query(
                `UPDATE inventories SET quantity = quantity + $1
         WHERE id = $2 RETURNING *`,
                [quantity || 1, existing.rows[0].id]
            );
            return result.rows[0];
        }

        const result = await pool.query(
            `INSERT INTO inventories (game_save_id, item_id, item_type, name, stats, equipped, quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [
                gameSaveId,
                itemId,
                itemType,
                name,
                JSON.stringify(stats),
                equipped || false,
                quantity || 1,
            ]
        );
        return result.rows[0];
    },

    async findByGameSaveId(gameSaveId) {
        const result = await pool.query(
            `SELECT * FROM inventories WHERE game_save_id = $1 ORDER BY item_type, name`,
            [gameSaveId]
        );
        return result.rows;
    },

    async findByItemId(gameSaveId, itemId) {
        const result = await pool.query(
            `SELECT * FROM inventories WHERE game_save_id = $1 AND item_id = $2`,
            [gameSaveId, itemId]
        );
        return result.rows[0] || null;
    },

    async findEquipped(gameSaveId, itemType) {
        const result = await pool.query(
            `SELECT * FROM inventories
       WHERE game_save_id = $1 AND item_type = $2 AND equipped = TRUE`,
            [gameSaveId, itemType]
        );
        return result.rows[0] || null;
    },

    async equip(id, gameSaveId) {
        const item = await pool.query(
            `SELECT item_type FROM inventories WHERE id = $1 AND game_save_id = $2`,
            [id, gameSaveId]
        );
        if (!item.rows[0]) return null;

        await pool.query(
            `UPDATE inventories SET equipped = FALSE
       WHERE game_save_id = $1 AND item_type = $2 AND equipped = TRUE`,
            [gameSaveId, item.rows[0].item_type]
        );

        const result = await pool.query(
            `UPDATE inventories SET equipped = TRUE
       WHERE id = $1 AND game_save_id = $2
       RETURNING *`,
            [id, gameSaveId]
        );
        return result.rows[0];
    },

    async removeItem(gameSaveId, itemId) {
        const existing = await pool.query(
            `SELECT id, quantity FROM inventories
       WHERE game_save_id = $1 AND item_id = $2`,
            [gameSaveId, itemId]
        );

        if (!existing.rows[0]) return null;

        if (existing.rows[0].quantity > 1) {
            const result = await pool.query(
                `UPDATE inventories SET quantity = quantity - 1
         WHERE id = $1 RETURNING *`,
                [existing.rows[0].id]
            );
            return result.rows[0];
        }

        await pool.query(
            `DELETE FROM inventories WHERE id = $1`,
            [existing.rows[0].id]
        );
        return { deleted: true };
    },

    async hasItem(gameSaveId, itemId) {
        const result = await pool.query(
            `SELECT id FROM inventories WHERE game_save_id = $1 AND item_id = $2`,
            [gameSaveId, itemId]
        );
        return result.rows.length > 0;
    },

    async createInitialInventory(gameSaveId) {
        await pool.query(
            `INSERT INTO inventories (game_save_id, item_id, item_type, name, stats, equipped, quantity)
       VALUES ($1, 'steel_sword', 'weapon', 'Steel Sword', '{"damage": 10, "type": "steel"}', TRUE, 1)`,
            [gameSaveId]
        );
        await pool.query(
            `INSERT INTO inventories (game_save_id, item_id, item_type, name, stats, equipped, quantity)
       VALUES ($1, 'leather_armor', 'armor', 'Leather Armor', '{"defense": 5, "resist": "physical"}', TRUE, 1)`,
            [gameSaveId]
        );
        await pool.query(
            `INSERT INTO inventories (game_save_id, item_id, item_type, name, stats, equipped, quantity)
       VALUES ($1, 'swallow_potion', 'potion', 'Swallow', '{"heal": 30}', FALSE, 2)`,
            [gameSaveId]
        );
    },
};

module.exports = Inventory;
