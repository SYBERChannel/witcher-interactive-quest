import React from 'react';
import useGameState from '../../hooks/useGameState';

const GameHUD = ({ onToggleInventory }) => {
    const { gameState } = useGameState();

    if (!gameState) return null;

    const hpPercent = (gameState.hp / gameState.max_hp) * 100;
    const isLow = hpPercent < 20;

    return (
        <div className="game-hud">
            <div className="hud-stats">
                <div className="hud-stat">
                    <span className="hud-stat-label">Level</span>
                    <span className="hud-stat-value">{gameState.level}</span>
                </div>
                <div className="hud-stat">
                    <span className="hud-stat-label">XP</span>
                    <span className="hud-stat-value">{gameState.xp}</span>
                </div>
                <div className="hud-stat">
                    <span className="hud-stat-label">Gold</span>
                    <span className="hud-stat-value">{gameState.gold}</span>
                </div>
            </div>

            <div className="hud-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="hud-hp">
                    <div className="hud-hp-label">
                        <span>Vitality</span>
                        <span>{gameState.hp} / {gameState.max_hp}</span>
                    </div>
                    <div className="hp-bar-wrapper">
                        <div
                            className={`hp-bar-fill hp-bar-fill--game${isLow ? ' hp-bar-fill--low' : ''}`}
                            style={{ width: `${Math.max(0, hpPercent)}%` }}
                        />
                    </div>
                </div>
                <button 
                    className="btn-secondary" 
                    onClick={onToggleInventory}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', height: 'fit-content' }}
                >
                    <span style={{ marginRight: '0.5rem' }}>🎒</span> Inventory
                </button>
            </div>
        </div>
    );
};

export default GameHUD;
