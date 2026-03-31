const GameSave = require("../models/GameSave");
const BattleEngine = require("../services/BattleEngine");
const AppError = require("../utils/AppError");

const activeBattles = new Map();

const getBattle = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("Активная игра не найдена", 404);
        }

        const battleId = req.params.id;
        const battleInit = BattleEngine.getBattleInit(battleId, gameSave);

        const battleKey = `${gameSave.id}_${battleId}`;
        activeBattles.set(battleKey, {
            playerHp: gameSave.hp,
            enemyHp: battleInit.enemyHp,
            rounds: [],
        });

        res.status(200).json({
            status: "success",
            data: {
                battle: {
                    ...battleInit,
                    playerHp: gameSave.hp,
                    playerMaxHp: gameSave.max_hp,
                    playerLevel: gameSave.level,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

const sendAction = async (req, res, next) => {
    try {
        const gameSave = await GameSave.findByUserId(req.user.userId);
        if (!gameSave) {
            throw new AppError("Активная игра не найдена", 404);
        }

        const battleId = req.params.id;
        const battleKey = `${gameSave.id}_${battleId}`;

        let battleState = activeBattles.get(battleKey);
        if (!battleState) {
            const battleInit = BattleEngine.getBattleInit(battleId, gameSave);
            battleState = {
                playerHp: gameSave.hp,
                enemyHp: battleInit.enemyHp,
                rounds: [],
            };
            activeBattles.set(battleKey, battleState);
        }

        const result = await BattleEngine.processAction(
            gameSave,
            battleId,
            req.body.type,
            battleState
        );

        battleState.playerHp = result.playerHp;
        battleState.enemyHp = result.enemyHp;
        battleState.rounds = result.rounds;

        if (result.battleResult) {
            activeBattles.delete(battleKey);
        }

        res.status(200).json({
            status: "success",
            data: {
                playerHp: result.playerHp,
                enemyHp: result.enemyHp,
                round: result.round,
                battleResult: result.battleResult,
                xpGained: result.xpGained,
                loot: result.loot,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getBattle, sendAction };
