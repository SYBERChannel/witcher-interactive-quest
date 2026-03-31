import { create } from 'zustand';
import * as battleApi from '../api/battle.api';

const useBattleStore = create((set, get) => ({
    battleData: null,
    loading: false,
    error: null,
    roundResult: null,
    actionError: null,

    initBattle: async (battleId) => {
        set({ loading: true, error: null, battleData: null, roundResult: null, actionError: null });
        try {
            const response = await battleApi.getBattle(battleId);
            const battle = response.data.battle;

            set({
                battleData: {
                    id: battle.battleId,
                    player: {
                        hp: battle.playerHp,
                        maxHp: battle.playerMaxHp,
                        level: battle.playerLevel || 1,
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
                    xpTotal: 0,
                },
                loading: false,
            });
        } catch (err) {
            set({ error: err.message || 'Не удалось загрузить бой', loading: false });
        }
    },

    performAction: async (battleId, action) => {
        set({ loading: true, actionError: null });
        try {
            const response = await battleApi.sendAction(battleId, action);
            const data = response.data;
            const prev = get().battleData;

            const logParts = [];
            if (data.round) {
                const actionNames = { attack: 'атакой', parry: 'парированием', sign: 'знаком', potion: 'зельем' };
                const pAct = actionNames[data.round.playerAction] || data.round.playerAction;
                const eAct = actionNames[data.round.enemyAction] || data.round.enemyAction;
                const pDmg = Math.abs(data.round.enemyHpChange || 0);
                const eDmg = Math.abs(data.round.playerHpChange || 0);
                if (pDmg > 0) logParts.push(`Геральт наносит ${pDmg} урона ${pAct}.`);
                if (eDmg > 0) logParts.push(`${prev.enemy.name} наносит ${eDmg} урона ${eAct}.`);
                if (pDmg === 0 && eDmg === 0) logParts.push('Оба бойца выжидают. Урон не нанесён.');
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
            const errorMsg = err.response?.data?.message || err.message || 'Действие не выполнено';
            if (errorMsg.toLowerCase().includes('зелий') || errorMsg.toLowerCase().includes('potion')) {
                set({ actionError: 'Нет доступных зелий!', loading: false });
            } else {
                set({ error: errorMsg, loading: false });
            }
            return null;
        }
    },

    clearActionError: () => set({ actionError: null }),

    resetBattle: () => set({ battleData: null, roundResult: null, error: null, actionError: null })
}));

export default useBattleStore;
