const fs = require("fs");
const path = require("path");
const GameSave = require("../models/GameSave");
const Inventory = require("../models/Inventory");
const AppError = require("../utils/AppError");

const scenesDir = path.join(__dirname, "..", "data", "scenes");

const loadAllScenes = () => {
    const scenes = {};
    const files = fs.readdirSync(scenesDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(scenesDir, file), "utf-8"));
        for (const scene of data) {
            scenes[scene.id] = scene;
        }
    }
    return scenes;
};

let scenesCache = null;

const getScenes = () => {
    if (!scenesCache) {
        scenesCache = loadAllScenes();
    }
    return scenesCache;
};

const getScene = (sceneId) => {
    const scenes = getScenes();
    return scenes[sceneId] || null;
};

const getCurrentScene = async (gameSave) => {
    const scene = getScene(gameSave.current_scene_id);
    if (!scene) {
        throw new AppError("Scene not found: " + gameSave.current_scene_id, 404);
    }
    return scene;
};

const filterChoices = (scene, gameSave, inventory) => {
    return scene.choices.filter((choice) => {
        if (choice.requires) {
            if (choice.requires.item) {
                const hasItem = inventory.some((inv) => inv.item_id === choice.requires.item);
                if (!hasItem) return false;
            }
            if (choice.requires.flag) {
                if (!gameSave.flags[choice.requires.flag]) return false;
            }
        }
        return true;
    });
};

const buildScenePayload = async (gameSave) => {
    const scene = await getCurrentScene(gameSave);
    const inventory = await Inventory.findByGameSaveId(gameSave.id);
    const availableChoices = filterChoices(scene, gameSave, inventory);

    return {
        id: scene.id,
        branch: scene.branch,
        title: scene.title,
        text: scene.text,
        background: scene.background,
        music: scene.music,
        choices: availableChoices.map((c) => ({
            id: c.id,
            label: c.label,
        })),
    };
};

const validateChoice = (scene, choiceId, gameSave, inventory) => {
    const choice = scene.choices.find((c) => c.id === choiceId);
    if (!choice) {
        throw new AppError("Invalid choice", 400);
    }

    if (choice.requires) {
        if (choice.requires.item) {
            const hasItem = inventory.some((inv) => inv.item_id === choice.requires.item);
            if (!hasItem) {
                throw new AppError("Missing required item: " + choice.requires.item, 400);
            }
        }
        if (choice.requires.flag) {
            if (!gameSave.flags[choice.requires.flag]) {
                throw new AppError("Missing required flag: " + choice.requires.flag, 400);
            }
        }
    }

    return choice;
};

const applyEffects = async (effects, gameSave) => {
    const updatedFlags = { ...gameSave.flags };
    let hpChange = 0;
    let xpChange = 0;
    let goldChange = 0;
    const itemsToAdd = [];

    for (const effect of effects) {
        switch (effect.type) {
            case "set_flag":
                updatedFlags[effect.flag] = true;
                break;
            case "remove_flag":
                delete updatedFlags[effect.flag];
                break;
            case "add_item":
                itemsToAdd.push(effect.item);
                break;
            case "remove_item":
                await Inventory.removeItem(gameSave.id, effect.item);
                break;
            case "add_xp":
                xpChange += effect.amount;
                break;
            case "add_gold":
                goldChange += effect.amount;
                break;
            case "modify_hp":
                hpChange += effect.amount;
                break;
        }
    }

    const newXp = gameSave.xp + xpChange;
    const newLevel = Math.floor(newXp / 100) + 1;
    const newHp = Math.max(0, Math.min(gameSave.max_hp, gameSave.hp + hpChange));
    const newGold = Math.max(0, gameSave.gold + goldChange);

    await GameSave.updateFlags(gameSave.id, updatedFlags);
    if (xpChange !== 0) {
        await GameSave.updateXp(gameSave.id, newXp, newLevel);
    }
    if (hpChange !== 0) {
        await GameSave.updateHp(gameSave.id, newHp);
    }
    if (goldChange !== 0) {
        await GameSave.updateGold(gameSave.id, newGold);
    }

    return { updatedFlags, itemsToAdd, newHp, newXp, newLevel, newGold };
};

const processChoice = async (gameSave, choiceId) => {
    const scene = await getCurrentScene(gameSave);
    const inventory = await Inventory.findByGameSaveId(gameSave.id);
    const choice = validateChoice(scene, choiceId, gameSave, inventory);

    const choicesMade = [...(gameSave.choices_made || []), choiceId];
    await GameSave.updateScene(gameSave.id, choice.next_scene_id, choiceId, choicesMade);

    if (choice.branch_switch) {
        await GameSave.updateBranch(gameSave.id, choice.branch_switch);
    }

    const effectResult = await applyEffects(choice.effects, gameSave);

    const isEnding = choice.next_scene_id.startsWith("__ending_");

    return {
        nextSceneId: choice.next_scene_id,
        branchSwitch: choice.branch_switch || null,
        leadsToBattle: choice.leads_to_battle || null,
        effects: effectResult,
        isEnding,
    };
};

module.exports = {
    getScene,
    getScenes,
    getCurrentScene,
    buildScenePayload,
    processChoice,
    applyEffects,
};
