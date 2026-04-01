import React, { useState, useEffect } from 'react';
import useBattle from '../../hooks/useBattle';
import { motion, AnimatePresence } from 'framer-motion';
import Inventory from '../Game/Inventory';

const XP_PER_LEVEL = 50;

const ENEMY_IMAGES = {
    'Королевский грифон': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHeGJIuK1GxM-tWrK76KVVrv0IFujhix1fSeU41ncjp57FRZzjFLQsTuBPrFzsOhbPDRgjJKpAHhq6xbUn7G_XqR3_aAXbydgN71Uy8f4ypY54ZcLwcHqBt8ZhM5AefDbik_js7yK3P4xEgc58eV9fCImDPQ2CER3ycEucJQClDpkautW1YSJm25X4MIkh3ygd5EyE7wNlkBGDV48ohg-qfbMH84LL-9Ub0gTRgadnAqriEkH7cHDGKyv7GRZ7VuAmAucfb8V-hm0T',
    'Стая утопцев': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv-Gp9WD8Hxo1eQdFr5kCzse5TAtzjQoZWsaEqPeiNDMYVPZyLCFM-JGCiEgv8QQ0uqhURmN0Ytt-06bI1A97nRJzrWIrERdopXwrZinR0rBZ12QaZGr0NCQehSEe79dqXFOCF3WhA9JhWW_OZAeHZ6S2YVpjX4CEVInkNdsUaC2m15uuZpgknNWwacekZ714ZazwXxAU7vL6qze2x2rtO0Nhhnb_fGN2LRS7M8RnQn8Wwq9wrVYYs8r-DK_NIeykXlSMcHqvaB41U',
    'default': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd4q5oNF63OjbphwVWJxVOjEpNcHQDqeH5xL5280pWsXMPQs10jmFXMJr3rsuwmOXYutunTaA1rbfigMp8n97KiFgD3iNsiC91GPSdBp2XexDqVStNSvu1tyumLDWAtWhcEVL5VHjYUb4Z7hm12G8dcSrY0mz0uPWet3ZU9lBCH7FLgOlPMCE53uaDJPFa6OxVNTErSvNj0d3vSNPafvu6FQjq-lXJUw9hwzUEGvY5Ps2NF1njs3ws5qV4m5caV3TdX5qau3FmuvQg'
};

const BattleArena = () => {
    const { battleData, performAction, loading, roundResult, actionError, clearActionError } = useBattle();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    useEffect(() => {
        if (actionError) {
            const timer = setTimeout(() => clearActionError(), 3000);
            return () => clearTimeout(timer);
        }
    }, [actionError, clearActionError]);

    if (!battleData) return <div className="battle-loading">Загрузка арены...</div>;

    const { player, enemy } = battleData;
    const playerHpPercent = player.maxHp > 0 ? (player.hp / player.maxHp) * 100 : 0;
    const enemyHpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
    const isOver = battleData.outcome !== null;

    const playerLevel = player.level || 1;
    const xpInCurrentLevel = (battleData.xpTotal || 0) % XP_PER_LEVEL;
    const xpPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

    const enemyImageUrl = ENEMY_IMAGES[enemy.name] || ENEMY_IMAGES['default'];

    const handleAction = async (type) => {
        if (loading || isOver) return;
        await performAction(battleData.id, type);
    };

    const getPlayerAnimation = () => {
        if (!roundResult?.playerAction) return {};
        if (roundResult.playerAction === 'attack') {
            return { x: [0, 80, 0], transition: { duration: 0.5, ease: 'easeInOut' } };
        }
        if (roundResult.playerAction === 'parry') {
            return { x: [0, -40, 0], transition: { duration: 0.4, ease: 'easeInOut' } };
        }
        return {};
    };

    return (
        <main className="relative h-[100dvh] w-full flex flex-col overflow-hidden bg-surface-container-lowest">
            <div className="absolute inset-0 opacity-40 bg-cover bg-center grayscale mix-blend-overlay"
                style={{ backgroundImage: "url('/backgrounds/battle_arena.png')" }}
            />
            <div className="absolute inset-0 vignette" />

            <div className="relative z-20 w-full px-4 sm:px-12 pt-20 flex flex-col items-center">
                <h1 className="font-headline text-xl sm:text-3xl tracking-widest text-on-surface uppercase mb-2">{enemy.name}</h1>
                <div className="w-full max-w-3xl h-3 bg-surface-container-highest overflow-hidden">
                    <div className="h-full hp-gradient shadow-[0_0_15px_rgba(146,7,3,0.5)] transition-all duration-500" style={{ width: `${Math.max(0, enemyHpPercent)}%` }} />
                </div>
                <div className="w-full max-w-3xl flex justify-between mt-1 px-1">
                    <span className="font-label text-[10px] tracking-widest text-secondary uppercase">Здоровье</span>
                    <span className="font-label text-[10px] tracking-widest text-on-surface-variant">{enemy.hp.toLocaleString()} / {enemy.maxHp.toLocaleString()}</span>
                </div>
            </div>

            <div className="absolute inset-0 z-10 w-full h-full flex items-end justify-between px-4 sm:px-24 pb-[270px] sm:pb-[140px] pointer-events-none">
                <motion.div
                    className="relative w-[45%] sm:w-1/3 max-h-[50%] sm:max-h-[65%] flex items-end justify-start sm:justify-center"
                    animate={getPlayerAnimation()}
                >
                    <div className="relative inline-block h-full">
                        <img
                            alt="Геральт"
                            className="max-h-full w-auto object-contain object-bottom drop-shadow-[0_0_30px_rgba(241,201,125,0.2)]"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7cJVfYTW1vIVEo2AZE8ov22lJujF1uIumXjUH-Q5eQC-2XO3p5o1_JfPfm3RPXazs7ksXIXWj2SlcmQmQ8FOvekCLd-76XVbW1CwAL8OcEHufCGthbyNWzQ4aDevMtfQyHlscpttwQL5botSPp4bNYl4VpwYFF8kVG0uLmL6PbSEkhahuOUP4JFmwAokVzeqF0YdjzrcUj1ZDAHDARscPNVx2CAK77XjyskfZQwP4pxgyKgrKXuxuDOQXVOKvXnJPTXo9LGFEcZQ_"
                        />
                        {roundResult?.playerDamage > 0 && (
                            <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay animate-pulse" />
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className="relative w-[45%] sm:w-1/2 max-h-[50%] sm:max-h-[65%] flex items-end justify-end sm:justify-center transform scale-x-[-1]"
                    animate={roundResult?.enemyDamage > 0 ? { x: [0, 15, 0], opacity: [1, 0.6, 1] } : {}}
                >
                    <div className="relative inline-block h-full">
                        <img alt={enemy.name} className="max-h-full w-auto object-contain object-bottom monster-glow brightness-75" src={enemyImageUrl} />
                        {roundResult?.enemyDamage > 0 && (
                            <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay animate-pulse" />
                        )}
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {actionError && (
                    <motion.div
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-error-container text-on-error border border-error/30 font-label text-sm uppercase tracking-widest shadow-2xl"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {actionError}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-28 sm:bottom-36 px-4 sm:px-12 flex justify-between items-end z-20 pointer-events-none">
                <div className="flex flex-col gap-2 w-40 sm:w-72 pointer-events-auto">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                            <span className="font-headline text-sm sm:text-lg text-primary tracking-tighter">Геральт из Ривии</span>
                            <span className="font-label text-[10px] text-on-surface-variant">УР. {playerLevel}</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-highest">
                            <div className="h-full hp-gradient transition-all duration-500" style={{ width: `${Math.max(0, playerHpPercent)}%` }} />
                        </div>
                        <div className="flex justify-between mt-0.5">
                            <span className="font-label text-[9px] text-secondary uppercase">Здоровье</span>
                            <span className="font-label text-[9px] text-on-surface-variant">{player.hp} / {player.maxHp}</span>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:block w-80 p-6 bg-surface-container-low/80 backdrop-blur-md border-l-4 border-primary-container pointer-events-auto min-h-[120px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={roundResult?.logMessage || 'init'}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <p className="font-body italic text-sm text-on-surface-variant leading-relaxed">
                                {roundResult?.logMessage || 'Чудовище возвышается перед тобой. Твой серебряный клинок гудит в предвкушении.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {roundResult?.logMessage && (
                <div className="sm:hidden absolute inset-x-0 bottom-28 px-4 z-20 pointer-events-none flex justify-end">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={roundResult.logMessage}
                            className="w-1/2 p-3 bg-surface-container-low/85 backdrop-blur-md border-l-2 border-primary-container"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <p className="font-body italic text-xs text-on-surface-variant leading-relaxed">
                                {roundResult.logMessage}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <div className="mt-auto relative z-30 bg-surface-container-lowest border-t border-outline-variant/20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-4 sm:pb-0">
                {isOver ? (
                    <div className="h-20 flex flex-col items-center justify-center">
                        <h2 className={`font-headline text-2xl uppercase tracking-widest ${battleData.outcome === 'won' ? 'text-primary' : 'text-secondary'}`}>
                            {battleData.outcome === 'won' ? 'Победа' : 'Поражение'}
                        </h2>
                        <p className="font-label text-[10px] text-on-surface-variant mt-1">БОЙ ЗАВЕРШЁН</p>
                    </div>
                ) : (
                    <div className="flex items-stretch">
                        <button
                            className="group relative flex flex-col items-center justify-center flex-1 py-4 sm:py-5 bg-surface-container hover:bg-surface-container-highest transition-all duration-300 active:scale-95 border-b-2 border-transparent hover:border-primary disabled:opacity-50 border-r border-outline-variant/30 last:border-r-0"
                            onClick={() => handleAction('attack')}
                            disabled={loading}
                        >
                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-xl sm:text-2xl">swords</span>
                            <span className="font-headline text-xs sm:text-sm tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors mt-1">Атака</span>
                        </button>
                        <button
                            className="group relative flex flex-col items-center justify-center flex-1 py-4 sm:py-5 bg-surface-container hover:bg-surface-container-highest transition-all duration-300 active:scale-95 border-b-2 border-transparent hover:border-primary disabled:opacity-50 border-r border-outline-variant/30 last:border-r-0"
                            onClick={() => handleAction('parry')}
                            disabled={loading}
                        >
                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-xl sm:text-2xl">shield</span>
                            <span className="font-headline text-xs sm:text-sm tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors mt-1">Парирование</span>
                        </button>
                        <button
                            className="group relative flex flex-col items-center justify-center flex-1 py-4 sm:py-5 bg-surface-container hover:bg-surface-container-highest transition-all duration-300 active:scale-95 border-b-2 border-transparent hover:border-primary disabled:opacity-50 border-r border-outline-variant/30 last:border-r-0"
                            onClick={() => handleAction('sign')}
                            disabled={loading}
                        >
                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-xl sm:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            <span className="font-headline text-xs sm:text-sm tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors mt-1">Знак</span>
                        </button>
                        <button
                            className="group relative flex flex-col items-center justify-center flex-1 py-4 sm:py-5 bg-surface-container hover:bg-surface-container-highest transition-all duration-300 active:scale-95 border-b-2 border-transparent hover:border-primary disabled:opacity-50 border-r border-outline-variant/30 last:border-r-0"
                            onClick={() => handleAction('potion')}
                            disabled={loading}
                        >
                            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-xl sm:text-2xl">science</span>
                            <span className="font-headline text-xs sm:text-sm tracking-widest uppercase text-on-surface group-hover:text-primary transition-colors mt-1">Зелье</span>
                        </button>
                    </div>
                )}
            </div>

            {isInventoryOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsInventoryOpen(false)} />
                    <aside className="fixed top-0 right-0 h-full w-80 bg-surface-container-low p-6 flex flex-col gap-6 border-l border-outline-variant/10 shadow-2xl z-50 overflow-y-auto">
                        <Inventory />
                    </aside>
                </>
            )}
        </main>
    );
};

export default BattleArena;
