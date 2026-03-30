import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameState } from '../api/game.api'; // Reuse existing
import { submitLeaderboard } from '../api/battle.api'; // Assuming generic or battle api carries it
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

    if (loading) return <div>Loading destiny...</div>;
    if (!finalState) return <div>Data unreachable.</div>;

    return (
        <div className="ending-page">
            <div className="ending-content">
                <h1>Tale Ended</h1>
                <h2>Geralt of Rivia</h2>

                <div className="final-stats">
                    <div className="stat-row">
                        <span>Path Chosen:</span>
                        <span className="val">{finalState.branch || 'Unknown'}</span>
                    </div>
                    <div className="stat-row">
                        <span>Total XP:</span>
                        <span className="val">{finalState.xp}</span>
                    </div>
                    <div className="stat-row">
                        <span>Level:</span>
                        <span className="val">{finalState.level}</span>
                    </div>
                    <div className="stat-row">
                        <span>Gold:</span>
                        <span className="val">{finalState.gold}</span>
                    </div>
                </div>

                <div className="ending-actions">
                    {!submitted ? (
                        <button onClick={handleSubmit} className="action-btn submit">
                            Submit to Leaderboard
                        </button>
                    ) : (
                        <p className="submitted-msg">Score Recorded.</p>
                    )}

                    <button onClick={() => navigate('/')} className="action-btn menu">
                        Main Menu
                    </button>
                </div>
            </div>

            <style>{`
                .ending-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #111;
                    color: #e0e0e0;
                }
                .ending-content {
                    text-align: center;
                    background: #222;
                    border: 2px solid #d4af37;
                    padding: 3rem;
                    max-width: 600px;
                    width: 90%;
                }
                h1 { color: #d4af37; font-family: 'Cinzel', serif; font-size: 3rem; margin-bottom: 0.5rem; }
                h2 { color: #aaa; margin-bottom: 2rem; font-weight: normal; }
                .final-stats {
                    margin-bottom: 2rem;
                    border-top: 1px solid #444;
                    border-bottom: 1px solid #444;
                    padding: 1rem 0;
                }
                .stat-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 1.2rem;
                }
                .val { color: #d4af37; }
                .ending-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .action-btn {
                    padding: 1rem;
                    font-size: 1.1rem;
                    cursor: pointer;
                    border: none;
                    font-family: 'Cinzel', serif;
                }
                .submit { background: #d4af37; color: #111; }
                .menu { background: transparent; border: 1px solid #555; color: #aaa; }
                .menu:hover { border-color: #d4af37; color: #d4af37; }
                .submitted-msg { color: #4caf50; font-style: italic; }
            `}</style>
        </div>
    );
};

export default EndingPage;
