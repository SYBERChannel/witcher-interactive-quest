import React, { useEffect, useState } from 'react';
import useGameState from '../hooks/useGameState';
import GameHUD from '../components/Game/GameHUD';
import SceneView from '../components/Game/SceneView';
import ChoiceList from '../components/Game/ChoiceList';
import Inventory from '../components/Game/Inventory';
import RandomEventModal from '../components/Game/RandomEventModal';

const GamePage = () => {
    const { fetchState, gameState, currentScene, loading, error } = useGameState();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    useEffect(() => {
        fetchState();
    }, []);

    if (loading && !gameState) {
        return (
            <div className="scene-placeholder">
                Loading world...
            </div>
        );
    }

    if (error) {
        return (
            <div className="scene-placeholder" style={{ flexDirection: 'column', gap: 'var(--space-3)' }}>
                <span style={{ color: 'var(--error)', fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>
                    Something went wrong
                </span>
                <span style={{ color: 'var(--outline)' }}>{error}</span>
                <button className="btn-secondary" onClick={fetchState}>Retry</button>
            </div>
        );
    }

    return (
        <div className="game-page">
            <GameHUD onToggleInventory={() => setIsInventoryOpen(prev => !prev)} />

            <div className="game-layout">
                <main className="game-main">
                    <SceneView scene={currentScene} />
                    <ChoiceList />
                </main>

                <aside className={`game-sidebar ${isInventoryOpen ? 'open' : ''}`}>
                    <Inventory />
                </aside>
                
                {/* Overlay to click-to-close */}
                {isInventoryOpen && (
                    <div className="sidebar-overlay" onClick={() => setIsInventoryOpen(false)} />
                )}
            </div>

            <RandomEventModal />
        </div>
    );
};

export default GamePage;
