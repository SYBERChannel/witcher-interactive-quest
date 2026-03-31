import useBattleStore from '../store/battleStore';

const useBattle = () => {
    const battleData = useBattleStore((state) => state.battleData);
    const loading = useBattleStore((state) => state.loading);
    const error = useBattleStore((state) => state.error);
    const roundResult = useBattleStore((state) => state.roundResult);
    const actionError = useBattleStore((state) => state.actionError);

    const initBattle = useBattleStore((state) => state.initBattle);
    const performAction = useBattleStore((state) => state.performAction);
    const resetBattle = useBattleStore((state) => state.resetBattle);
    const clearActionError = useBattleStore((state) => state.clearActionError);

    return {
        battleData,
        loading,
        error,
        roundResult,
        actionError,
        initBattle,
        performAction,
        resetBattle,
        clearActionError
    };
};

export default useBattle;
