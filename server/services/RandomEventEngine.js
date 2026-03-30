const fs = require("fs");
const path = require("path");
const GameSave = require("../models/GameSave");

const eventsPath = path.join(__dirname, "..", "data", "events", "random_events.json");

let eventsCache = null;

const loadEvents = () => {
    if (!eventsCache) {
        const data = fs.readFileSync(eventsPath, "utf-8");
        eventsCache = JSON.parse(data);
    }
    return eventsCache;
};

const checkAndTrigger = async (scene, gameSave) => {
    if (!scene.random_event_pool || scene.random_event_pool.length === 0) {
        return null;
    }

    if (Math.random() >= (scene.random_event_chance || 0.25)) {
        return null;
    }

    const allEvents = loadEvents();
    const flags = gameSave.flags || {};

    const eligibleEvents = scene.random_event_pool
        .map((eventId) => allEvents.find((e) => e.id === eventId))
        .filter((event) => {
            if (!event) return false;

            if (flags[`event_${event.id}_seen`]) return false;

            if (event.condition) {
                if (event.condition.branch && event.condition.branch !== gameSave.branch) {
                    return false;
                }
                if (event.condition.flag && !flags[event.condition.flag]) {
                    return false;
                }
                if (event.condition.not_flag && flags[event.condition.not_flag]) {
                    return false;
                }
            }

            return true;
        });

    if (eligibleEvents.length === 0) {
        return null;
    }

    const selected = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];

    const updatedFlags = { ...flags, [`event_${selected.id}_seen`]: true };
    await GameSave.updateFlags(gameSave.id, updatedFlags);

    return {
        id: selected.id,
        type: selected.type,
        title: selected.title,
        text: selected.text,
        effects: selected.effects,
        battleId: selected.battle_id || null,
        choices: selected.choices || null,
    };
};

module.exports = { checkAndTrigger };
