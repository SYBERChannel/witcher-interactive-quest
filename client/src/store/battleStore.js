import { create } from 'zustand';
import * as battleApi from '../api/battle.api';

const useBattleStore = create((set) => ({
    battleData: null,
    loading: false,
    error: null,
    roundResult: null,

    initBattle: async (battleId) => {
        set({ loading: true, error: null, battleData: null, roundResult: null });
        try {
            const data = await battleApi.getBattle(battleId);
            set({ battleData: data, loading: false });
        } catch (err) {
            set({ error: err.message || 'Failed to load battle', loading: false });
        }
    },

    performAction: async (battleId, action, detail) => {
        set({ loading: true, error: null });
        try {
            const result = await battleApi.sendAction(battleId, action, detail);

            // Assuming result structure:
            // { battleState, roundResult, outcome }

            set({
                battleData: result.battleState,
                roundResult: result.roundResult,
                loading: false
            });

            return result.outcome; // 'won', 'lost', or null/undefined if ongoing
        } catch (err) {
            set({ error: err.message || 'Action failed', loading: false });
        }
    },

    resetBattle: () => set({ battleData: null, roundResult: null, error: null })
}));

export default useBattleStore;
