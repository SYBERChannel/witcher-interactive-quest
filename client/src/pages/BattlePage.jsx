import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBattle from '../hooks/useBattle';
import BattleHUD from '../components/Battle/BattleHUD';
import BattleArena from '../components/Battle/BattleArena';

const BattlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { initBattle, battleData, loading, error, resetBattle } = useBattle();

    useEffect(() => {
        initBattle(id);
        return () => {
            resetBattle();
        };
    }, [id]);

    useEffect(() => {
        if (battleData && battleData.outcome) {
            const timer = setTimeout(() => navigate('/game'), 2500);
            return () => clearTimeout(timer);
        }
    }, [battleData?.outcome, navigate]);

    if (loading && !battleData) {
        return (
            <div className="battle-page">
                <div className="battle-loading">
                    <div className="battle-loading-text">Preparing for combat...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="battle-page">
                <div className="battle-error">
                    <p>{error}</p>
                    <button className="btn-secondary" onClick={() => navigate('/game')}>
                        Return to game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="battle-page">
            <BattleHUD />
            <BattleArena />
        </div>
    );
};

export default BattlePage;
