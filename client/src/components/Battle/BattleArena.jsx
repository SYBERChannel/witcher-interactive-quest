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
                        <span className="sprite-label">Geralt</span>
                    </div>
                </motion.div>

                <motion.div
                    className="sprite enemy"
                    key={`enemy-${roundResult?.animationKey}`}
                    animate={getEnemyAnim()}
                    variants={enemyVariants}
                >
                    <div className="sprite-box enemy-box">
                        <span className="sprite-label">{battleData.enemy.name}</span>
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
