import React from 'react';
import useBattle from '../../hooks/useBattle';
import { motion, AnimatePresence } from 'framer-motion';

const BattleArena = () => {
    const { battleData, performAction, loading, roundResult } = useBattle();

    if (!battleData) return <div className="battle-loading">Loading arena...</div>;

    const handleAction = async (type) => {
        if (loading) return;
        await performAction(battleData.id, type);
    };

    const geraltVariants = {
        idle: { x: 0, scale: 1 },
        attack: { x: [0, 80, 0], scale: [1, 1.1, 1], transition: { duration: 0.4 } },
        hit: { x: [0, -15, 0], opacity: [1, 0.6, 1], transition: { duration: 0.3 } },
    };

    const enemyVariants = {
        idle: { x: 0, scale: 1 },
        attack: { x: [0, -80, 0], scale: [1, 1.1, 1], transition: { duration: 0.4 } },
        hit: { x: [0, 15, 0], opacity: [1, 0.6, 1], transition: { duration: 0.3 } },
    };

    const getGeraltAnim = () => {
        if (!roundResult) return 'idle';
        if (roundResult.enemyDamage > 0) return 'attack';
        if (roundResult.playerDamage > 0) return 'hit';
        return 'idle';
    };

    const getEnemyAnim = () => {
        if (!roundResult) return 'idle';
        if (roundResult.playerDamage > 0) return 'attack';
        if (roundResult.enemyDamage > 0) return 'hit';
        return 'idle';
    };

    const isOver = battleData.outcome !== null;

    return (
        <div className="battle-arena">
            <div className="arena-visuals">
                <motion.div
                    className="sprite geralt"
                    key={`geralt-${roundResult?.animationKey}`}
                    animate={getGeraltAnim()}
                    variants={geraltVariants}
                >
                    <div className="sprite-box">
                        <svg className="sprite-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 10L60 40H90L65 60L75 90L50 70L25 90L35 60L10 40H40L50 10Z" fill="url(#geraltGrad)" />
                            <defs>
                                <linearGradient id="geraltGrad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#F1C97D" />
                                    <stop offset="1" stopColor="#A87A29" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </motion.div>

                <motion.div
                    className="sprite enemy"
                    key={`enemy-${roundResult?.animationKey}`}
                    animate={getEnemyAnim()}
                    variants={enemyVariants}
                >
                    <div className="sprite-box enemy-box">
                        <svg className="sprite-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 20 Q 50 10 80 40 T 60 90 Q 30 70 20 20 Z" fill="url(#enemyGrad)" />
                            <circle cx="65" cy="40" r="5" fill="#111" />
                            <path d="M40 80 L 30 95 M 50 85 L 45 100 M 60 80 L 65 95" stroke="url(#enemyGrad)" strokeWidth="3" />
                            <defs>
                                <linearGradient id="enemyGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#920703" />
                                    <stop offset="1" stopColor="#4A0201" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                {roundResult && roundResult.logMessage && (
                    <motion.div
                        className="round-log"
                        key={roundResult.logMessage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p>{roundResult.logMessage}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {isOver && (
                <motion.div
                    className="battle-outcome"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="battle-outcome-title">
                        {battleData.outcome === 'won' ? 'Victory' : 'Defeat'}
                    </h2>
                    {battleData.outcome === 'won' && battleData.xpGained > 0 && (
                        <p className="battle-outcome-xp">+{battleData.xpGained} XP</p>
                    )}
                    {battleData.outcome === 'won' && battleData.loot.length > 0 && (
                        <div className="battle-outcome-loot">
                            {battleData.loot.map((item, i) => (
                                <span key={i} className="battle-loot-item">{item.name}</span>
                            ))}
                        </div>
                    )}
                    <p className="battle-outcome-redirect">Returning to the path...</p>
                </motion.div>
            )}

            {!isOver && (
                <div className="battle-controls">
                    <button className="battle-action-btn" onClick={() => handleAction('attack')} disabled={loading}>
                        <span className="action-icon">⚔</span> Attack
                    </button>
                    <button className="battle-action-btn" onClick={() => handleAction('parry')} disabled={loading}>
                        <span className="action-icon">🛡</span> Parry
                    </button>
                    <button className="battle-action-btn" onClick={() => handleAction('sign')} disabled={loading}>
                        <span className="action-icon">🔥</span> Igni
                    </button>
                    <button className="battle-action-btn" onClick={() => handleAction('potion')} disabled={loading}>
                        <span className="action-icon">🧪</span> Potion
                    </button>
                </div>
            )}
        </div>
    );
};

export default BattleArena;
