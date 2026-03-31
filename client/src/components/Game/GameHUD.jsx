import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameState from '../../hooks/useGameState';

const XP_PER_LEVEL = 50;

const GameHUD = ({ onToggleInventory }) => {
    const { gameState } = useGameState();
    const navigate = useNavigate();

    if (!gameState) return null;

    const hpPercent = (gameState.hp / gameState.max_hp) * 100;
    const xpInCurrentLevel = gameState.xp % XP_PER_LEVEL;
    const xpPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
    const isLow = hpPercent < 20;

    return (
        <>
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-[#131313] dark:bg-[#0e0e0e] bg-gradient-to-b from-[#201f1f] to-transparent shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-none font-['Noto_Serif'] antialiased tracking-wide">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#D4AF37] tracking-tighter uppercase">Ведьмак</span>
                    <span className="text-sm font-bold text-[#d0c5af] tracking-tight uppercase">Путь Геральта</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-surface-container-high transition-colors"
                        onClick={() => navigate('/shop')}
                        title="Лавка"
                    >
                        <span className="material-symbols-outlined text-[#D4AF37] cursor-pointer hover:scale-110 transition-transform">payments</span>
                        <span className="font-label text-[10px] uppercase text-on-surface-variant hidden md:inline">Лавка</span>
                    </button>
                    <button
                        className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                        onClick={() => navigate('/')}
                    >
                        Главное Меню
                    </button>
                </div>
            </header>

            <div className="bg-surface-container-low p-6 flex flex-wrap items-center gap-8 shadow-2xl relative overflow-hidden group mt-20 mx-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                    <div className="flex justify-between items-end">
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Уровень {gameState.level}</span>
                        <span className="font-label text-[10px] text-primary">{xpInCurrentLevel} / {XP_PER_LEVEL} ОП</span>
                    </div>
                    <div className="h-1 bg-surface-container-highest w-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_10px_rgba(241,201,125,0.5)]" style={{ width: `${Math.min(100, xpPercent)}%` }}></div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 flex-grow min-w-[200px]">
                    <div className="flex justify-between items-end">
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Здоровье</span>
                        <span className="font-label text-[10px] text-secondary">{gameState.hp} / {gameState.max_hp}</span>
                    </div>
                    <div className="h-2 bg-secondary-container w-full overflow-hidden">
                        <div className={`h-full bg-secondary shadow-[0_0_15px_rgba(255,180,168,0.4)] ${isLow ? 'animate-pulse' : ''}`} style={{ width: `${Math.max(0, hpPercent)}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                        <span className="font-label font-bold text-on-surface">{gameState.gold.toLocaleString()} <span className="text-[10px] text-on-surface-variant uppercase ml-1">крон</span></span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameHUD;
