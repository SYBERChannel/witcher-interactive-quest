const GameSave = require("../models/GameSave");
const SceneEngine = require("../services/SceneEngine");
const RandomEventEngine = require("../services/RandomEventEngine");
const InventoryService = require("../services/InventoryService");
const ShopService = require("../services/ShopService");
const Leaderboard = require("../models/Leaderboard");
const BattleLog = require("../models/BattleLog");
const AppError = require("../utils/AppError");

const newGame = async (req, res, next) => {
    try {
        const gameSave = await GameSave.create(req.user.userId);
        await InventoryService.createInitialInventory(gameSave.id);

        const scenePayload = await SceneEngine.buildScenePayload(gameSave);

        res.status(201).json({
            status: "success",
            data: { gameState: gameSave, scene: scenePayload },
        });
    } catch (err) {
        next(err);
    }
};

const getState = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        res.status(200).json({
            status: "success",
            data: { gameState: gameSave },
        });
    } catch (err) {
        next(err);
    }
};

const getScene = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const scenePayload = await SceneEngine.buildScenePayload(gameSave);

        res.status(200).json({
            status: "success",
            data: { scene: scenePayload },
        });
    } catch (err) {
        next(err);
    }
};

const makeChoice = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const scene = await SceneEngine.getCurrentScene(gameSave);
        const result = await SceneEngine.processChoice(gameSave, req.body.choice_id);

        for (const itemId of result.effects.itemsToAdd) {
            const def = InventoryService.getItemDefinition(itemId);
            if (def) {
                await InventoryService.addItem(gameSave.id, itemId, def.item_type, def.name, def.stats);
            }
        }

        let randomEvent = null;
        if (!result.leadsToBattle && !result.isEnding) {
            const nextScene = SceneEngine.getScene(result.nextSceneId);
            if (nextScene) {
                const updatedSave = await GameSave.findById(gameSave.id);
                randomEvent = await RandomEventEngine.checkAndTrigger(nextScene, updatedSave);

                if (randomEvent && randomEvent.effects && randomEvent.effects.length > 0) {
                    await SceneEngine.applyEffects(randomEvent.effects, updatedSave);
                }
            }
        }

        if (result.isEnding) {
            const finalSave = await GameSave.findById(gameSave.id);
            const battlesWon = await BattleLog.countWonByGameSave(gameSave.id);
            const scenesVisited = (finalSave.choices_made || []).length;

            await Leaderboard.submit(
                req.user.userId,
                finalSave.xp,
                finalSave.level,
                finalSave.branch,
                scenesVisited,
                battlesWon
            );
        }

        const responseData = {
            nextSceneId: result.nextSceneId,
            branchSwitch: result.branchSwitch,
            leadsToBattle: result.leadsToBattle,
            isEnding: result.isEnding,
            effects: {
                hp: result.effects.newHp,
                xp: result.effects.newXp,
                level: result.effects.newLevel,
                gold: result.effects.newGold,
            },
        };

        if (randomEvent) {
            responseData.randomEvent = randomEvent;
        }

        if (!result.leadsToBattle && !result.isEnding) {
            const updatedSave = await GameSave.findById(gameSave.id);
            responseData.scene = await SceneEngine.buildScenePayload(updatedSave);
        }

        res.status(200).json({
            status: "success",
            data: responseData,
        });
    } catch (err) {
        next(err);
    }
};

const getInventory = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const inventory = await InventoryService.getInventory(gameSave.id);

        res.status(200).json({
            status: "success",
            data: { inventory },
        });
    } catch (err) {
        next(err);
    }
};

const useItem = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const result = await InventoryService.useItem(gameSave, req.body.item_id);
        const updatedSave = await GameSave.findById(gameSave.id);

        res.status(200).json({
            status: "success",
            data: {
                result,
                gameState: {
                    hp: updatedSave.hp,
                    max_hp: updatedSave.max_hp,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

const equipItem = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const result = await InventoryService.useItem(gameSave, req.body.item_id);
        const updatedInventory = await InventoryService.getInventory(gameSave.id);

        res.status(200).json({
            status: "success",
            data: { result, inventory: updatedInventory },
        });
    } catch (err) {
        next(err);
    }
};

const getShop = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const items = ShopService.getShopItems();

        res.status(200).json({
            status: "success",
            data: { items, gold: gameSave.gold },
        });
    } catch (err) {
        next(err);
    }
};

const buyItem = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("No active game found", 404);
        }

        const result = await ShopService.buyItem(gameSave, req.body.item_id);

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { newGame, getState, getScene, makeChoice, getInventory, useItem, equipItem, getShop, buyItem };
