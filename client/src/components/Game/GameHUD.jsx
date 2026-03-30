import React from 'react';
import useGameState from '../../hooks/useGameState';

const GameHUD = () => {
    const { gameState } = useGameState();

    if (!gameState) return null;

    const hpPercent = (gameState.hp / gameState.max_hp) * 100;

    return (
        <div className="game-hud">
            <div className="hud-stats">
                <div className="stat-group">
                    <span className="label">Level</span>
                    <span className="value">{gameState.level}</span>
                </div>
                <div className="stat-group">
                    <span className="label">XP</span>
                    <span className="value">{gameState.xp}</span>
                </div>
                <div className="stat-group">
                    <span className="label">Gold</span>
                    <span className="value">{gameState.gold}</span>
                </div>
            </div>

            <div className="hp-container">
                <div className="hp-bar-bg">
                    <div
                        className="hp-bar-fill"
                        style={{ width: `${Math.max(0, hpPercent)}%` }}
                    />
                </div>
                <div className="hp-text">{gameState.hp} / {gameState.max_hp}</div>
            </div>

            <style>{`
                .game-hud {
                    background: #1a1a1a;
                    border-bottom: 1px solid #444;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .hud-stats {
                    display: flex;
                    gap: 2rem;
                }
                .stat-group {
                    display: flex;
                    flex-direction: column;
                }
                .stat-group .label {
                    font-size: 0.75rem;
                    color: #888;
                    text-transform: uppercase;
                }
                .stat-group .value {
                    font-size: 1.2rem;
                    color: #d4af37;
                    font-weight: bold;
                }
                .hp-container {
                    width: 300px;
                    position: relative;
                }
                .hp-bar-bg {
                    height: 20px;
                    background: #333;
                    border: 1px solid #555;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .hp-bar-fill {
                    height: 100%;
                    background: #cd5c5c;
                    transition: width 0.3s ease;
                }
                .hp-text {
                    text-align: center;
                    font-size: 0.8rem;
                    margin-top: 0.2rem;
                    color: #ccc;
                }
            `}</style>
        </div>
    );
};

export default GameHUD;
