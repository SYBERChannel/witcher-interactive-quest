const Inventory = require("../models/Inventory");
const GameSave = require("../models/GameSave");
const AppError = require("../utils/AppError");

const SHOP_ITEMS = [
    { item_id: "silver_sword", item_type: "weapon", name: "Серебряный меч", stats: { damage: 20, type: "silver" }, price: 150, description: "Клинок, выкованный для убийства чудовищ." },
    { item_id: "steel_sword_enhanced", item_type: "weapon", name: "Улучшенный стальной меч", stats: { damage: 15, type: "steel" }, price: 100, description: "Качественный стальной клинок." },
    { item_id: "frost_armor", item_type: "armor", name: "Морозная броня", stats: { defense: 15, resist: "frost" }, price: 200, description: "Броня с защитой от мороза." },
    { item_id: "chain_mail", item_type: "armor", name: "Кольчуга", stats: { defense: 10, resist: "physical" }, price: 120, description: "Крепкая кольчужная броня." },
    { item_id: "swallow_potion", item_type: "potion", name: "Ласточка", stats: { heal: 30 }, price: 25, description: "Восстанавливает 30 здоровья." },
    { item_id: "thunderbolt_potion", item_type: "potion", name: "Гром", stats: { heal: 0, damage_boost: 1.5 }, price: 40, description: "Временно увеличивает урон от атак." },
    { item_id: "white_raffard_potion", item_type: "potion", name: "Отвар Белого Раффара", stats: { heal: 50 }, price: 60, description: "Мощное лечебное зелье. Восстанавливает 50 здоровья." },
    { item_id: "drowner_brain", item_type: "potion", name: "Мозг утопца", stats: { heal: 10 }, price: 15, description: "Грубый лечебный компонент." },
];

const getShopItems = () => {
    const shuffled = [...SHOP_ITEMS].sort(() => 0.5 - Math.random());
    const count = Math.min(6, shuffled.length);
    return shuffled.slice(0, count);
};

const buyItem = async (gameSave, itemId) => {
    const shopItem = SHOP_ITEMS.find((i) => i.item_id === itemId);
    if (!shopItem) {
        throw new AppError("Предмет недоступен в магазине", 404);
    }

    if (gameSave.gold < shopItem.price) {
        throw new AppError("Недостаточно крон", 400);
    }

    const newGold = gameSave.gold - shopItem.price;
    await GameSave.updateGold(gameSave.id, newGold);

    await Inventory.addItem(
        gameSave.id,
        shopItem.item_id,
        shopItem.item_type,
        shopItem.name,
        shopItem.stats,
        false,
        1
    );

    return {
        purchased: true,
        item: shopItem,
        remainingGold: newGold,
    };
};

module.exports = {
    getShopItems,
    buyItem,
    SHOP_ITEMS,
};
