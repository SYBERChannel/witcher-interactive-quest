import React from 'react';
import useBattle from '../../hooks/useBattle';
import { motion } from 'framer-motion';

const BattleHUD = () => {
    const { battleData, loading } = useBattle();

    if (!battleData) return null;

    const { player, enemy } = battleData;

    const playerHpPercent = (player.hp / player.maxHp) * 100;
    const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;

    return (
        <div className="battle-hud">
            <div className="hud-top">
                <div className="unit-stat player-stat">
                    <div className="name">Geralt</div>
                    <div className="hp-bar-container">
                        <motion.div
                            className="hp-bar-fill player"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, playerHpPercent)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="hp-text">{player.hp} / {player.maxHp}</div>
                </div>

                <div className="vs">VS</div>

                <div className="unit-stat enemy-stat">
                    <div className="name">{enemy.name}</div>
                    <div className="hp-bar-container">
                        <motion.div
                            className="hp-bar-fill enemy"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(0, enemyHpPercent)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="hp-text">{enemy.hp} / {enemy.maxHp}</div>
                </div>
            </div>

            <style>{`
                .battle-hud {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(0,0,0,0.6);
                    border-bottom: 2px solid #555;
                    margin-bottom: 1rem;
                }
                .hud-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .unit-stat {
                    width: 40%;
                }
                .name {
                    font-family: 'Cinzel', serif;
                    color: #d4af37;
                    margin-bottom: 0.5rem;
                    font-size: 1.2rem;
                }
                .hp-bar-container {
                    height: 15px;
                    background: #333;
                    border: 1px solid #666;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .hp-bar-fill {
                    height: 100%;
                }
                .hp-bar-fill.player { background-color: #cd5c5c; }
                .hp-bar-fill.enemy { background-color: #8b0000; }
                .hp-text {
                    font-size: 0.8rem;
                    color: #aaa;
                    margin-top: 5px;
                    text-align: right;
                }
                .vs {
                    font-family: 'Cinzel', serif;
                    font-weight: bold;
                    color: #555;
                    font-size: 1.5rem;
                }
            `}</style>
        </div>
    );
};

export default BattleHUD;
