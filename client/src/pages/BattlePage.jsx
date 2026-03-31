import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBattle from '../hooks/useBattle';
import BattleHUD from '../components/Battle/BattleHUD';
import BattleArena from '../components/Battle/BattleArena';
import audioManager from '../services/AudioManager';

const BattlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { initBattle, battleData, loading, error, resetBattle } = useBattle();

    useEffect(() => {
        initBattle(id);
        audioManager.play('battle_theme');
        return () => {
            resetBattle();
            audioManager.fadeOut(1000);
        };
    }, [id]);

    useEffect(() => {
        if (battleData && battleData.outcome) {
            const timer = setTimeout(() => navigate('/game'), 4000);
            return () => clearTimeout(timer);
        }
    }, [battleData?.outcome, navigate]);

    if (loading && !battleData) {
        return (
            <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center font-headline text-secondary italic">
                Обнажаем клинок...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center gap-4">
                <span className="font-headline text-secondary text-2xl">Бой не может начаться</span>
                <span className="text-on-surface-variant italic">{error}</span>
                <button className="px-6 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-all" onClick={() => navigate('/game')}>
                    Отступить
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface select-none overflow-hidden relative">
            <BattleHUD />
            <BattleArena />
        </div>
    );
};

export default BattlePage;
