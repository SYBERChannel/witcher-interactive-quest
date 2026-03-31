const fs = require("fs");
const path = require("path");
const GameSave = require("../models/GameSave");
const Inventory = require("../models/Inventory");
const BattleLog = require("../models/BattleLog");
const AppError = require("../utils/AppError");

const enemiesPath = path.join(__dirname, "..", "data", "enemies", "enemies.json");

let enemiesCache = null;

const loadEnemies = () => {
    if (!enemiesCache) {
        const data = fs.readFileSync(enemiesPath, "utf-8");
        const list = JSON.parse(data);
        enemiesCache = {};
        for (const enemy of list) {
            enemiesCache[enemy.id] = enemy;
        }
    }
    return enemiesCache;
};

const getEnemy = (battleId) => {
    const enemies = loadEnemies();
    const enemy = enemies[battleId];
    if (!enemy) {
        throw new AppError("Enemy not found: " + battleId, 404);
    }
    return { ...enemy };
};

const getBattleInit = (battleId, gameSave) => {
    const enemy = getEnemy(battleId);
    return {
        battleId: enemy.id,
        enemyName: enemy.name,
        enemyHp: enemy.hp,
        enemyAttack: enemy.attack,
        enemyDefense: enemy.defense,
        playerHp: gameSave ? gameSave.hp : 100,
        playerMaxHp: gameSave ? gameSave.max_hp : 100,
        playerLevel: gameSave ? gameSave.level : 1,
    };
};

const XP_PER_LEVEL = 50;

const calculateLevel = (totalXp) => {
    return Math.floor(totalXp / XP_PER_LEVEL) + 1;
};

const calculateMaxHp = (level) => {
    return 100 + (level - 1) * 15;
};

const getLevelDamageBonus = (level) => {
    return (level - 1) * 2;
};

const chooseEnemyAction = (enemy) => {
    const rand = Math.random();
    const weights = enemy.ai_weights;
    let cumulative = 0;

    cumulative += weights.attack;
    if (rand < cumulative) return "attack";

    cumulative += weights.parry;
    if (rand < cumulative) return "parry";

    cumulative += weights.sign;
    if (rand < cumulative) return "sign";

    return "potion";
};

const calculateRound = (playerAction, enemyAction, playerWeapon, playerArmor, enemy, levelBonus) => {
    const baseDamage = playerWeapon ? playerWeapon.stats.damage || 10 : 10;
    const playerDamage = baseDamage + (levelBonus || 0);
    const playerDefense = playerArmor ? playerArmor.stats.defense || 0 : 0;
    let playerHpChange = 0;
    let enemyHpChange = 0;
    let animationKey = "";

    if (playerAction === "attack" && enemyAction === "attack") {
        enemyHpChange = -Math.max(1, playerDamage - enemy.defense);
        playerHpChange = -Math.max(1, enemy.attack - playerDefense);
        animationKey = "slash";
    } else if (playerAction === "attack" && enemyAction === "parry") {
        enemyHpChange = 0;
        playerHpChange = -Math.max(1, Math.floor(enemy.attack * 0.5) - playerDefense);
        animationKey = "parry_counter";
    } else if (playerAction === "parry" && enemyAction === "attack") {
        enemyHpChange = -Math.max(1, Math.floor(playerDamage * 0.5));
        playerHpChange = 0;
        animationKey = "parry_counter";
    } else if (playerAction === "parry" && enemyAction === "parry") {
        enemyHpChange = 0;
        playerHpChange = 0;
        animationKey = "parry_counter";
    } else if (playerAction === "sign" && enemyAction === "attack") {
        enemyHpChange = -Math.max(1, Math.floor(playerDamage * 1.3));
        playerHpChange = 0;
        animationKey = "igni_cast";
    } else if (playerAction === "sign" && enemyAction === "parry") {
        enemyHpChange = -Math.max(1, Math.floor(playerDamage * 0.7));
        playerHpChange = 0;
        animationKey = "igni_cast";
    } else if (playerAction === "sign" && enemyAction === "sign") {
        enemyHpChange = -Math.max(1, Math.floor(playerDamage * 0.8));
        playerHpChange = -Math.max(1, Math.floor(enemy.attack * 0.8));
        animationKey = "igni_cast";
    } else if (playerAction === "sign" && enemyAction === "potion") {
        enemyHpChange = -Math.max(1, Math.floor(playerDamage * 1.3));
        playerHpChange = 0;
        animationKey = "igni_cast";
    } else if (playerAction === "potion" && enemyAction === "attack") {
        playerHpChange = -Math.max(1, enemy.attack - playerDefense);
        animationKey = "drink_potion";
    } else if (playerAction === "potion" && enemyAction === "parry") {
        playerHpChange = 0;
        animationKey = "drink_potion";
    } else if (playerAction === "potion" && enemyAction === "sign") {
        playerHpChange = -Math.max(1, Math.floor(enemy.attack * 0.8));
        animationKey = "drink_potion";
    } else if (playerAction === "potion" && enemyAction === "potion") {
        playerHpChange = 0;
        animationKey = "drink_potion";
    } else if (playerAction === "attack" && enemyAction === "sign") {
        enemyHpChange = -Math.max(1, playerDamage - enemy.defense);
        playerHpChange = -Math.max(1, Math.floor(enemy.attack * 0.8));
        animationKey = "slash";
    } else if (playerAction === "attack" && enemyAction === "potion") {
        enemyHpChange = -Math.max(1, playerDamage - enemy.defense);
        playerHpChange = 0;
        animationKey = "slash";
    } else if (playerAction === "parry" && enemyAction === "sign") {
        enemyHpChange = 0;
        playerHpChange = -Math.max(1, Math.floor(enemy.attack * 0.5));
        animationKey = "parry_counter";
    } else if (playerAction === "parry" && enemyAction === "potion") {
        enemyHpChange = 0;
        playerHpChange = 0;
        animationKey = "parry_counter";
    }

    return { playerHpChange, enemyHpChange, animationKey, playerAction, enemyAction };
};

const processAction = async (gameSave, battleId, playerAction, battleState) => {
    const enemy = getEnemy(battleId);
    const inventory = await Inventory.findByGameSaveId(gameSave.id);
    const playerWeapon = inventory.find((i) => i.item_type === "weapon" && i.equipped);
    const playerArmor = inventory.find((i) => i.item_type === "armor" && i.equipped);

    const levelBonus = getLevelDamageBonus(gameSave.level);

    let potionHeal = 0;
    if (playerAction === "potion") {
        const potion = inventory.find((i) => i.item_type === "potion" && i.quantity > 0);
        if (!potion) {
            throw new AppError("Нет доступных зелий", 400);
        }
        potionHeal = potion.stats.heal || 0;
        await Inventory.removeItem(gameSave.id, potion.item_id);
    }

    const enemyAction = chooseEnemyAction(enemy);
    const round = calculateRound(playerAction, enemyAction, playerWeapon, playerArmor, enemy, levelBonus);

    let currentPlayerHp = battleState.playerHp + round.playerHpChange + potionHeal;
    currentPlayerHp = Math.max(0, Math.min(gameSave.max_hp, currentPlayerHp));

    let currentEnemyHp = battleState.enemyHp + round.enemyHpChange;
    currentEnemyHp = Math.max(0, currentEnemyHp);

    const rounds = [...battleState.rounds, round];

    let battleResult = null;
    let xpGained = 0;
    let loot = [];

    if (currentEnemyHp <= 0) {
        battleResult = "won";
        xpGained = enemy.xp_reward;
        loot = resolveLoot(enemy);

        const newTotalXp = gameSave.xp + xpGained;
        const newLevel = calculateLevel(newTotalXp);
        const newMaxHp = calculateMaxHp(newLevel);
        const hpToSave = Math.min(currentPlayerHp + (newMaxHp - gameSave.max_hp), newMaxHp);

        await GameSave.updateHp(gameSave.id, hpToSave);
        await GameSave.updateXp(gameSave.id, newTotalXp, newLevel);
        if (newMaxHp !== gameSave.max_hp) {
            await GameSave.update(gameSave.id, {
                ...gameSave,
                hp: hpToSave,
                max_hp: newMaxHp,
                xp: newTotalXp,
                level: newLevel,
            });
        }
        await GameSave.incrementBattleCount(gameSave.id);

        for (const item of loot) {
            await Inventory.addItem(gameSave.id, item.item_id, item.item_type, item.name, item.stats, false, 1);
        }

        await BattleLog.create(gameSave.id, battleId, enemy.name, rounds, "won", xpGained, loot);
    } else if (currentPlayerHp <= 0) {
        battleResult = "lost";
        const newGold = Math.floor(gameSave.gold * 0.5);
        await GameSave.updateHp(gameSave.id, Math.floor(gameSave.max_hp * 0.5));
        await GameSave.updateGold(gameSave.id, newGold);

        await BattleLog.create(gameSave.id, battleId, enemy.name, rounds, "lost", 0, []);
    } else {
        await GameSave.updateHp(gameSave.id, currentPlayerHp);
    }

    return {
        playerHp: currentPlayerHp,
        enemyHp: currentEnemyHp,
        round,
        battleResult,
        xpGained,
        loot,
        rounds,
    };
};

const resolveLoot = (enemy) => {
    const loot = [];
    for (const entry of enemy.loot_table) {
        if (Math.random() < entry.chance) {
            loot.push({
                item_id: entry.item_id,
                item_type: entry.item_type,
                name: entry.name,
                stats: entry.stats,
            });
        }
    }
    return loot;
};

module.exports = {
    getEnemy,
    getBattleInit,
    processAction,
    calculateLevel,
    calculateMaxHp,
    XP_PER_LEVEL,
};
