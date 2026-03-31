import { create } from 'zustand';
import * as gameApi from '../api/game.api';

const useGameStore = create((set, get) => ({
    gameState: null,
    currentScene: null,
    inventory: [],
    activeEvent: null,
    loading: false,
    error: null,

    fetchState: async () => {
        set({ loading: true, error: null });
        try {
            const [statePayload, scenePayload, inventoryPayload] = await Promise.all([
                gameApi.getGameState(),
                gameApi.getScene(),
                gameApi.getInventory()
            ]);

            set({
                gameState: statePayload.data.gameState,
                currentScene: scenePayload.data.scene,
                inventory: inventoryPayload.data.inventory,
                loading: false
            });
        } catch (err) {
            set({ error: err.message || 'Failed to fetch game state', loading: false });
            throw err;
        }
    },

    startNewGame: async () => {
        set({ loading: true, error: null });
        try {
            await gameApi.newGame();

            const [statePayload, scenePayload, inventoryPayload] = await Promise.all([
                gameApi.getGameState(),
                gameApi.getScene(),
                gameApi.getInventory()
            ]);

            set({
                gameState: statePayload.data.gameState,
                currentScene: scenePayload.data.scene,
                inventory: inventoryPayload.data.inventory,
                loading: false
            });
        } catch (err) {
            set({ error: err.message || 'Failed to start new game', loading: false });
            throw err;
        }
    },

    resumeGame: async () => {
        return get().fetchState();
    },

    submitChoice: async (choiceId) => {
        set({ loading: true, error: null });
        try {
            const result = await gameApi.makeChoice(choiceId);
            const choiceResult = result.data;

            if (choiceResult.randomEvent) {
                set({ activeEvent: choiceResult.randomEvent });
            }

            if (choiceResult.scene) {
                set({ currentScene: choiceResult.scene });
            }

            if (choiceResult.effects) {
                const prev = get().gameState;
                if (prev) {
                    set({
                        gameState: {
                            ...prev,
                            hp: choiceResult.effects.hp,
                            xp: choiceResult.effects.xp,
                            level: choiceResult.effects.level,
                            gold: choiceResult.effects.gold,
                            branch: choiceResult.branchSwitch || prev.branch,
                        }
                    });
                }
            }

            if (!choiceResult.leadsToBattle && !choiceResult.isEnding) {
                const [statePayload, inventoryPayload] = await Promise.all([
                    gameApi.getGameState(),
                    gameApi.getInventory()
                ]);
                set({
                    gameState: statePayload.data.gameState,
                    inventory: inventoryPayload.data.inventory,
                });
            }

            set({ loading: false });

            return {
                leadsToBattle: choiceResult.leadsToBattle || null,
                isEnding: choiceResult.isEnding || false,
            };
        } catch (err) {
            set({ error: err.message || 'Choice failed', loading: false });
            return null;
        }
    },

    handleEvent: async () => {
        set({ activeEvent: null, loading: false });
    },

    useItem: async (itemId) => {
        try {
            await gameApi.useItem(itemId);
            const [statePayload, inventoryPayload] = await Promise.all([
                gameApi.getGameState(),
                gameApi.getInventory()
            ]);
            set({
                gameState: statePayload.data.gameState,
                inventory: inventoryPayload.data.inventory,
            });
        } catch (err) {
            console.error(err);
        }
    },

    equipItem: async (itemId) => {
        try {
            const result = await gameApi.equipItem(itemId);
            if (result.data && result.data.inventory) {
                set({ inventory: result.data.inventory });
            } else {
                const inventoryPayload = await gameApi.getInventory();
                set({ inventory: inventoryPayload.data.inventory });
            }
        } catch (err) {
            console.error(err);
        }
    },
}));

export default useGameStore;
