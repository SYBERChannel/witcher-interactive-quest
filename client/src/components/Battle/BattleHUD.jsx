import React from 'react';
import { useNavigate } from 'react-router-dom';
import useBattle from '../../hooks/useBattle';

const BattleHUD = () => {
    const { battleData } = useBattle();
    const navigate = useNavigate();

    if (!battleData) return null;

    const { enemy } = battleData;

    const enemyHpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;

    return (
        <>
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#131313] dark:bg-[#0e0e0e] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#D4AF37] tracking-tighter uppercase font-['Noto_Serif']">Ведьмак</span>
                    <span className="text-sm font-bold text-[#d0c5af] tracking-tight uppercase font-['Noto_Serif']">Путь Геральта</span>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                        onClick={() => navigate('/game')}
                    >
                        Отступить
                    </button>
                </div>
            </header>
        </>
    );
};

export default BattleHUD;
