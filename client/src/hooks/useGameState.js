import useGameStore from '../store/gameStore';
import { useEffect } from 'react';

const useGameState = () => {
    const gameState = useGameStore((state) => state.gameState);
    const currentScene = useGameStore((state) => state.currentScene);
    const inventory = useGameStore((state) => state.inventory);
    const activeEvent = useGameStore((state) => state.activeEvent);
    const loading = useGameStore((state) => state.loading);
    const error = useGameStore((state) => state.error);

    const fetchState = useGameStore((state) => state.fetchState);
    const submitChoice = useGameStore((state) => state.submitChoice);
    const handleEvent = useGameStore((state) => state.handleEvent);
    const useItem = useGameStore((state) => state.useItem);

    const startNewGame = useGameStore((state) => state.startNewGame);
    const resumeGame = useGameStore((state) => state.resumeGame);

    return {
        gameState,
        currentScene,
        inventory,
        activeEvent,
        loading,
        error,
        fetchState,
        submitChoice,
        handleEvent,
        useItem,
        startNewGame,
        resumeGame
    };
};

export default useGameState;
