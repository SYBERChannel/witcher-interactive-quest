import React, { useEffect, useState } from 'react';
import useBattle from '../../hooks/useBattle';
import { motion, AnimatePresence } from 'framer-motion';

const BattleArena = () => {
    const { battleData, performAction, loading, roundResult } = useBattle();
    const [animationKey, setAnimationKey] = useState(null);

    // Sync animation key from backend
    useEffect(() => {
        if (roundResult && roundResult.animationKey) {
            setAnimationKey(roundResult.animationKey);
            // Reset animation key after short delay to allow re-trigger
            const timer = setTimeout(() => setAnimationKey(null), 1000);
            return () => clearTimeout(timer);
        }
    }, [roundResult]);

    if (!battleData) return <div>Loading arena...</div>;

    const handleAction = async (type) => {
        if (loading) return;
        await performAction(battleData.id, type);
    };

    // Animation variants
    const geraltVariants = {
        idle: { x: 0 },
        attack: { x: 100, transition: { type: 'spring', stiffness: 300, damping: 10 } },
        hit: { x: -20, color: 'red' }
    };

    const enemyVariants = {
        idle: { x: 0 },
        attack: { x: -100, transition: { type: 'spring', stiffness: 300, damping: 10 } },
        hit: { x: 20, opacity: 0.5 }
    };

    return (
        <div className="battle-arena">
            <div className="arena-visuals">
                <motion.div
                    className="sprite geralt"
                    animate={
                        animationKey === 'player_attack' ? 'attack' :
                            roundResult?.playerDamage > 0 ? 'hit' : 'idle'
                    }
                    variants={geraltVariants}
                >
                    <div className="sprite-box">Geralt</div>
                </motion.div>

                <motion.div
                    className="sprite enemy"
                    animate={
                        animationKey === 'enemy_attack' ? 'attack' :
                            roundResult?.enemyDamage > 0 ? 'hit' : 'idle'
                    }
                    variants={enemyVariants}
                >
                    <div className="sprite-box enemy-box">{battleData.enemy.name}</div>
                </motion.div>

                {/* Visual FX overlay could go here */}
                {roundResult && (
                    <div className="round-log">
                        <p>{roundResult.logMessage}</p>
                    </div>
                )}
            </div>

            <div className="battle-controls">
                <button onClick={() => handleAction('attack')} disabled={loading}>Attack</button>
                <button onClick={() => handleAction('parry')} disabled={loading}>Parry</button>
                <button onClick={() => handleAction('sign')} disabled={loading}>Sign (Igni)</button>
                <button onClick={() => handleAction('potion')} disabled={loading}>Potion</button>
            </div>

            <style>{`
                .battle-arena {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .arena-visuals {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 100%;
                    height: 400px;
                    background: #111; /* Placeholder for bg image */
                    border: 2px solid #333;
                    position: relative;
                    margin-bottom: 2rem;
                    overflow: hidden;
                }
                .sprite {
                    width: 100px;
                    height: 150px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .sprite-box {
                    width: 80px;
                    height: 120px;
                    background: #cd5c5c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #fff;
                    color: white;
                    font-weight: bold;
                }
                .enemy-box {
                    background: #444;
                    border-color: #8b0000;
                }
                .battle-controls {
                    display: flex;
                    gap: 1rem;
                }
                .battle-controls button {
                    min-width: 100px;
                    padding: 1rem;
                    background: #222;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    font-family: 'Cinzel', serif;
                    font-size: 1rem;
                }
                .battle-controls button:hover:not(:disabled) {
                    background: #d4af37;
                    color: #000;
                }
                .battle-controls button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .round-log {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.7);
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    color: #fff;
                    width: 80%;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default BattleArena;
