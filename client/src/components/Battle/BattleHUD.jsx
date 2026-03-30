import React from 'react';
import useBattle from '../../hooks/useBattle';
import { motion } from 'framer-motion';

const BattleHUD = () => {
    const { battleData } = useBattle();

    if (!battleData) return null;

    const { player, enemy } = battleData;

    const playerHpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;
    const enemyHpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
    const playerLow = playerHpPercent < 20;
    const enemyLow = enemyHpPercent < 20;

    return (
        <div className="battle-hud">
            <div className="battle-hud-inner">
                <div className="battle-combatant">
                    <div className="battle-combatant-name">Geralt</div>
                    <div className="battle-combatant-hp-text">{player.hp} / {player.maxHp}</div>
                    <div className="hp-bar-wrapper">
                        <motion.div
                            className={`hp-bar-fill hp-bar-fill--player${playerLow ? ' hp-bar-fill--low' : ''}`}
                            animate={{ width: `${Math.max(0, playerHpPercent)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                <div className="battle-vs">
                    <span>VS</span>
                </div>

                <div className="battle-combatant battle-combatant--enemy">
                    <div className="battle-combatant-name">{enemy.name}</div>
                    <div className="battle-combatant-hp-text">{enemy.hp} / {enemy.maxHp}</div>
                    <div className="hp-bar-wrapper">
                        <motion.div
                            className={`hp-bar-fill hp-bar-fill--enemy${enemyLow ? ' hp-bar-fill--low' : ''}`}
                            animate={{ width: `${Math.max(0, enemyHpPercent)}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BattleHUD;
