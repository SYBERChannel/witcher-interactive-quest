import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const EndingPage = () => {
    const [finalState, setFinalState] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchFinal = async () => {
            try {
                const { getGameState } = await import('../api/game.api');
                const data = await getGameState();
                setFinalState(data.data.gameState);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinal();
    }, []);

    if (loading) {
        return (
            <div className="ending-page">
                <div className="ending-loading">The chronicle draws to a close...</div>
            </div>
        );
    }

    if (!finalState) {
        return (
            <div className="ending-page">
                <div className="ending-error-state">
                    <p>The tale could not be recovered.</p>
                    <button className="btn-secondary" onClick={() => navigate('/')}>Return to Menu</button>
                </div>
            </div>
        );
    }

    const getBranchNarrative = () => {
        if (finalState.branch === 'good') {
            return 'The fires of Kaer Morhen have dimmed, but the path carved through the Continent remains. As the sun sets over the fractured kingdoms, the tales of the Witcher echo in every tavern and keep. You chose to protect, to heal, and to stand against the darkness. Ciri has taken her place amongst the legends, and the world — though weary — finds a moment of respite.';
        }
        if (finalState.branch === 'bad') {
            return 'The frost spreads from the throne of the Wild Hunt, reshaping the world in your image. The Witcher who once hunted monsters now commands them. Kingdoms tremble at the sound of your riders. The path of power has claimed another — and the Continent will never forget the name of the White Wolf who chose dominion over mercy.';
        }
        return 'The path walked was neither light nor dark, but something between. The Witcher\'s neutrality preserved a fragile balance — no savior, no tyrant, but a blade for hire whose silence spoke louder than any decree. The world continues to turn, unchanged by your passage, yet forever marked by it.';
    };

    return (
        <div className="ending-page">
            <div className="ending-content">
                <div className="ending-label">Chronicle's Conclusion</div>
                <h1 className="ending-main-title">The White Wolf's Legacy</h1>
                <p className="ending-narrative">{getBranchNarrative()}</p>

                <div className="ending-character-name">
                    {user?.username || 'Geralt of Rivia'}
                </div>

                <div className="ending-stats">
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Path Chosen</span>
                        <span className={`ending-stat-value ending-branch--${finalState.branch || 'neutral'}`}>
                            {finalState.branch === 'good' ? 'The Path of Light' : finalState.branch === 'bad' ? 'The Path of Darkness' : 'The Neutral Path'}
                        </span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Total XP</span>
                        <span className="ending-stat-value">{finalState.xp}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Level Achieved</span>
                        <span className="ending-stat-value">{finalState.level}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Gold Accumulated</span>
                        <span className="ending-stat-value">{finalState.gold}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Battles Fought</span>
                        <span className="ending-stat-value">{finalState.battle_count || 0}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Scenes Visited</span>
                        <span className="ending-stat-value">{(finalState.choices_made || []).length}</span>
                    </div>
                </div>

                <div className="ending-quote">
                    "Witchers were made to kill monsters. It doesn't matter who posted the notice, the coin has to be right."
                </div>

                <div className="ending-actions">
                    {!submitted ? (
                        <p className="ending-submitted">Your score has been recorded in the chronicles.</p>
                    ) : null}

                    <button onClick={() => navigate('/')} className="btn-primary">
                        Return to Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndingPage;
