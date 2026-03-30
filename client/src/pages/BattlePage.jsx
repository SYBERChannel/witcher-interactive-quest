import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBattle from '../hooks/useBattle';
import { useAudio } from '../context/AudioContext';
import BattleHUD from '../components/Battle/BattleHUD';
import BattleArena from '../components/Battle/BattleArena';

const BattlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { initBattle, battleData, performAction, loading, error, resetBattle } = useBattle();
    const { playTrack } = useAudio();

    useEffect(() => {
        playTrack('battle_theme');
        initBattle(id);

        return () => {
            resetBattle();
        };
    }, [id]);

    useEffect(() => {
        if (battleData && battleData.outcome) {
            if (battleData.outcome === 'won') {
                // Short delay to show victory state
                setTimeout(() => navigate('/Game'), 2000);
            } else if (battleData.outcome === 'lost') {
                setTimeout(() => navigate('/Game'), 2000); // Should theoretically handle game over scene
            }
        }
    }, [battleData, navigate]);

    if (loading && !battleData) return <div className="loading">Entering combat...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="battle-page">
            <BattleHUD />
            <BattleArena />

            <style>{`
                .battle-page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #1a1a1a;
                }
                .loading, .error {
                    text-align: center;
                    margin-top: 4rem;
                    color: #ccc;
                    font-size: 1.5rem;
                }
                .error { color: #cd5c5c; }
            `}</style>
        </div>
    );
};

export default BattlePage;
