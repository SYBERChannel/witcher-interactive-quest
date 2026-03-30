import React, { useEffect } from 'react';
import useGameState from '../hooks/useGameState';
import GameHUD from '../components/Game/GameHUD';
import SceneView from '../components/Game/SceneView';
import ChoiceList from '../components/Game/ChoiceList';
import Inventory from '../components/Game/Inventory';
import RandomEventModal from '../components/Game/RandomEventModal';

const GamePage = () => {
    const { fetchState, gameState, currentScene, loading, error } = useGameState();

    useEffect(() => {
        fetchState();
    }, []);

    if (loading && !gameState) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading world...</div>;
    }

    if (error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#cd5c5c' }}>
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={fetchState}>Retry</button>
            </div>
        );
    }

    return (
        <div className="game-page">
            <GameHUD />

            <div className="game-layout">
                <main className="game-main">
                    <SceneView scene={currentScene} />
                    <ChoiceList />
                </main>

                <aside className="game-sidebar">
                    <Inventory />
                </aside>
            </div>

            <RandomEventModal />

            <style>{`
                .game-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .game-layout {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 2rem;
                    padding: 2rem;
                    flex: 1;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                }
                .game-main {
                    display: flex;
                    flex-direction: column;
                }
                .game-sidebar {
                    border-left: 1px solid #333;
                    padding-left: 1rem;
                }
                @media (max-width: 900px) {
                    .game-layout {
                        grid-template-columns: 1fr;
                    }
                    .game-sidebar {
                        border-left: none;
                        border-top: 1px solid #333;
                        padding-left: 0;
                        padding-top: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default GamePage;
