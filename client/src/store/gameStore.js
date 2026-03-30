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
            throw err; // Re-throw for UI handling
        }
    },

    startNewGame: async () => {
        set({ loading: true, error: null });
        try {
            // Architecture says: POST /api/game/new returns GameState
            // So we likely need to fetch Scene/Inventory after or backend returns all.
            // Based on flow: POST /game/new -> GameState + first ScenePayload
            // Let's assume we need to re-fetch or use returned data if structure supports it.
            // For safety and simplicity with current API:

            await gameApi.newGame();

            // Now fetch full state to be sure
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
        // Alias for fetchState but semantically different for UI
        return get().fetchState();
    },

    submitChoice: async (choiceId) => {
        set({ loading: true, error: null });
        try {
            const result = await gameApi.makeChoice(choiceId);

            // Result logic based on backend response shape
            // Ideally: { nextScene, effects, randomEvent, gameStateUpdate }

            if (result.randomEvent) {
                set({ activeEvent: result.randomEvent });
            }

            if (result.scene) {
                set({ currentScene: result.scene });
            }

            // Refresh state after choice to ensure sync
            // A bit expensive, but safe. Or update partially if backend returns changes.
            const [statePayload, inventoryPayload] = await Promise.all([
                gameApi.getGameState(),
                gameApi.getInventory()
            ]);

            set({
                gameState: statePayload.data.gameState,
                inventory: inventoryPayload.data.inventory,
                loading: false
            });

        } catch (err) {
            set({ error: err.message || 'Choice failed', loading: false });
        }
    },

    handleEvent: async (action) => {
        set({ loading: true, error: null });
        try {
            const result = await gameApi.respondToEvent(action);
            set({ activeEvent: null }); // Close modal
            // Refresh scene/state
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
            set({ error: err.message || 'Event failed', loading: false });
        }
    },

    useItem: async (itemId) => {
        // Optimistic or waiting? Let's wait.
        try {
            await gameApi.useItem(itemId);
            // Refresh inventory and state (hp healed?)
            const [statePayload, inventoryPayload] = await Promise.all([
                gameApi.getGameState(),
                gameApi.getInventory()
            ]);
            set({ gameState: statePayload.gameState, inventory: inventoryPayload.inventory });
        } catch (err) {
            console.error(err);
            // handle item error
        }
    }
}));

export default useGameStore;
