import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameState } from '../api/game.api';
import { submitLeaderboard } from '../api/battle.api';
import { useAudio } from '../context/AudioContext';

const EndingPage = () => {
    const [finalState, setFinalState] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { playTrack } = useAudio();

    useEffect(() => {
        playTrack('ending');
        const fetchFinal = async () => {
            try {
                const data = await getGameState();
                setFinalState(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinal();
    }, []);

    const handleSubmit = async () => {
        try {
            await submitLeaderboard();
            setSubmitted(true);
        } catch (err) {
            console.error('Submission failed', err);
        }
    };

    if (loading) return <div className="ending-loading">Loading destiny...</div>;
    if (!finalState) return <div className="ending-error-state">Data unreachable.</div>;

    return (
        <div className="ending-page">
            <div className="ending-content">
                <div className="ending-label">Journey Complete</div>
                <h1 className="ending-main-title">Tale Ended</h1>
                <p className="ending-character">Geralt of Rivia</p>

                <div className="ending-stats">
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Path Chosen</span>
                        <span className="ending-stat-value">{finalState.branch || 'Unknown'}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Total XP</span>
                        <span className="ending-stat-value">{finalState.xp}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Level</span>
                        <span className="ending-stat-value">{finalState.level}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Gold</span>
                        <span className="ending-stat-value">{finalState.gold}</span>
                    </div>
                </div>

                <div className="ending-actions">
                    {!submitted ? (
                        <button onClick={handleSubmit} className="btn-primary">
                            Submit to Leaderboard
                        </button>
                    ) : (
                        <p className="ending-submitted">Score recorded in the chronicles.</p>
                    )}

                    <button onClick={() => navigate('/')} className="btn-secondary">
                        Return to Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndingPage;
