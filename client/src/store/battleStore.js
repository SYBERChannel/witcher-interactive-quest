import { create } from 'zustand';
import * as battleApi from '../api/battle.api';

const useBattleStore = create((set, get) => ({
    battleData: null,
    loading: false,
    error: null,
    roundResult: null,

    initBattle: async (battleId) => {
        set({ loading: true, error: null, battleData: null, roundResult: null });
        try {
            const response = await battleApi.getBattle(battleId);
            const battle = response.data.battle;

            set({
                battleData: {
                    id: battle.battleId,
                    player: {
                        hp: battle.playerHp,
                        maxHp: battle.playerMaxHp,
                    },
                    enemy: {
                        name: battle.enemyName,
                        hp: battle.enemyHp,
                        maxHp: battle.enemyHp,
                        attack: battle.enemyAttack,
                        defense: battle.enemyDefense,
                    },
                    outcome: null,
                    loot: [],
                    xpGained: 0,
                },
                loading: false,
            });
        } catch (err) {
            set({ error: err.message || 'Failed to load battle', loading: false });
        }
    },

    performAction: async (battleId, action) => {
        set({ loading: true, error: null });
        try {
            const response = await battleApi.sendAction(battleId, action);
            const data = response.data;
            const prev = get().battleData;

            const logParts = [];
            if (data.round) {
                const pAct = data.round.playerAction;
                const eAct = data.round.enemyAction;
                const pDmg = Math.abs(data.round.enemyHpChange || 0);
                const eDmg = Math.abs(data.round.playerHpChange || 0);
                if (pDmg > 0) logParts.push(`Geralt deals ${pDmg} damage with ${pAct}.`);
                if (eDmg > 0) logParts.push(`${prev.enemy.name} deals ${eDmg} damage with ${eAct}.`);
                if (pDmg === 0 && eDmg === 0) logParts.push('Both combatants brace. No damage dealt.');
            }

            set({
                battleData: {
                    ...prev,
                    player: {
                        ...prev.player,
                        hp: data.playerHp,
                    },
                    enemy: {
                        ...prev.enemy,
                        hp: data.enemyHp,
                    },
                    outcome: data.battleResult || null,
                    loot: data.loot || [],
                    xpGained: data.xpGained || 0,
                },
                roundResult: {
                    playerAction: data.round?.playerAction,
                    enemyAction: data.round?.enemyAction,
                    playerDamage: Math.abs(data.round?.playerHpChange || 0),
                    enemyDamage: Math.abs(data.round?.enemyHpChange || 0),
                    animationKey: data.round?.animationKey,
                    logMessage: logParts.join(' '),
                },
                loading: false,
            });

            return data.battleResult || null;
        } catch (err) {
            set({ error: err.message || 'Action failed', loading: false });
            return null;
        }
    },

    resetBattle: () => set({ battleData: null, roundResult: null, error: null })
}));

export default useBattleStore;
