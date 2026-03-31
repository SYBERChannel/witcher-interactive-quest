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
            setError('Не удалось начать новую игру');
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
                setError('Активная игра не найдена');
            } else {
                setError('Не удалось загрузить игру');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-menu-page">
            <div className="menu-top-bar">
                <div className="menu-user-info">
                    <span className="menu-username">
                        {user?.username || user?.email}
                    </span>
                    <button
                        className="btn-text menu-logout-btn"
                        onClick={logout}
                    >
                        Выйти
                    </button>
                </div>
            </div>

            <div className="menu-center">
                <div className="menu-brand">
                    <div className="menu-brand-label">Тёмное Фэнтези Приключение</div>
                    <h1 className="menu-brand-title">Ведьмак</h1>
                    <p className="menu-brand-subtitle">Путь Геральта</p>
                </div>

                {error && (
                    <div className="stitch-error menu-error">{error}</div>
                )}

                <div className="menu-actions">
                    <button
                        className="btn-primary"
                        onClick={handleNewGame}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Новая Игра'}
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={handleContinue}
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Продолжить'}
                    </button>

                    <hr className="stitch-divider menu-separator" />

                    <Link to="/leaderboard">
                        <button
                            className="btn-secondary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            Таблица Лидеров
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MainMenuPage;
