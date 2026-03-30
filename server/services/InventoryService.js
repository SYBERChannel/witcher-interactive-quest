const Inventory = require("../models/Inventory");
const GameSave = require("../models/GameSave");
const AppError = require("../utils/AppError");

const getInventory = async (gameSaveId) => {
    return Inventory.findByGameSaveId(gameSaveId);
};

const addItem = async (gameSaveId, itemId, itemType, name, stats) => {
    return Inventory.addItem(gameSaveId, itemId, itemType, name, stats, false, 1);
};

const useItem = async (gameSave, itemId) => {
    const item = await Inventory.findByItemId(gameSave.id, itemId);
    if (!item) {
        throw new AppError("Item not found in inventory", 404);
    }

    if (item.item_type === "potion") {
        const heal = item.stats.heal || 0;
        const damageBoost = item.stats.damage_boost || null;

        if (heal > 0) {
            const newHp = Math.min(gameSave.max_hp, gameSave.hp + heal);
            await GameSave.updateHp(gameSave.id, newHp);
        }

        await Inventory.removeItem(gameSave.id, itemId);

        return {
            used: true,
            itemType: "potion",
            heal,
            damageBoost,
        };
    }

    if (item.item_type === "weapon" || item.item_type === "armor") {
        const equipped = await Inventory.equip(item.id, gameSave.id);
        return {
            used: true,
            itemType: item.item_type,
            equipped: equipped,
        };
    }

    throw new AppError("This item cannot be used directly", 400);
};

const hasItem = async (gameSaveId, itemId) => {
    return Inventory.hasItem(gameSaveId, itemId);
};

const createInitialInventory = async (gameSaveId) => {
    return Inventory.createInitialInventory(gameSaveId);
};

const getItemDefinition = (itemId) => {
    const itemDefinitions = {
        steel_sword: { item_type: "weapon", name: "Steel Sword", stats: { damage: 10, type: "steel" } },
        silver_sword: { item_type: "weapon", name: "Silver Sword", stats: { damage: 20, type: "silver" } },
        leather_armor: { item_type: "armor", name: "Leather Armor", stats: { defense: 5, resist: "physical" } },
        frost_armor: { item_type: "armor", name: "Frost Armor", stats: { defense: 15, resist: "frost" } },
        swallow_potion: { item_type: "potion", name: "Swallow", stats: { heal: 30 } },
        key_to_tower: { item_type: "key", name: "Key to the Tower", stats: { unlocks: "tower_door" } },
    };

    return itemDefinitions[itemId] || null;
};

module.exports = {
    getInventory,
    addItem,
    useItem,
    hasItem,
    createInitialInventory,
    getItemDefinition,
};
