import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import useGameState from '../hooks/useGameState';
import { Link, useNavigate } from 'react-router-dom';

const MainMenuPage = () => {
    const { logout } = useAuth();
    const user = useAuthStore((state) => state.user);
    const { startNewGame, resumeGame } = useGameState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleNewGame = async () => {
        setLoading(true);
        setError(null);
        try {
            await startNewGame();
            navigate('/game');
        } catch (err) {
            console.error(err);
            setError('Failed to start new game');
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        setLoading(true);
        setError(null);
        try {
            await resumeGame();
            navigate('/game');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                setError('No active game found');
            } else {
                setError('Failed to load game');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-menu">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Witcher: Path of Geralt</h1>
                <div>
                    <span style={{ marginRight: '1rem' }}>Welcome, {user?.username || user?.email}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>

            <div className="menu-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                {error && <div style={{ color: '#cd5c5c', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                <button
                    className="menu-btn"
                    onClick={handleNewGame}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'New Game'}
                </button>

                <button
                    className="menu-btn"
                    onClick={handleContinue}
                    disabled={loading}
                >
                    {loading ? 'Resuming...' : 'Continue'}
                </button>

                <Link to="/leaderboard">
                    <button className="menu-btn" style={{ width: '100%' }} disabled={loading}>
                        Leaderboard
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default MainMenuPage;
