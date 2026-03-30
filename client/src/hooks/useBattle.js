import useBattleStore from '../store/battleStore';

const useBattle = () => {
    const battleData = useBattleStore((state) => state.battleData);
    const loading = useBattleStore((state) => state.loading);
    const error = useBattleStore((state) => state.error);
    const roundResult = useBattleStore((state) => state.roundResult);

    const initBattle = useBattleStore((state) => state.initBattle);
    const performAction = useBattleStore((state) => state.performAction);
    const resetBattle = useBattleStore((state) => state.resetBattle);

    return {
        battleData,
        loading,
        error,
        roundResult,
        initBattle,
        performAction,
        resetBattle
    };
};

export default useBattle;
