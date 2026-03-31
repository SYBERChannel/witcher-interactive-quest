import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-emblem">Создай свою легенду</div>
                    <h1 className="auth-title">Регистрация</h1>
                    <p className="auth-subtitle">Каждый ведьмак должен с чего-то начать</p>
                </div>

                {error && <div className="stitch-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="stitch-input-group">
                        <label htmlFor="reg-username">Имя ведьмака</label>
                        <input
                            id="reg-username"
                            className="stitch-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Геральт из Ривии"
                            required
                        />
                    </div>
                    <div className="stitch-input-group">
                        <label htmlFor="reg-email">Эл. почта</label>
                        <input
                            id="reg-email"
                            className="stitch-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="geralt@kaermorhen.com"
                            required
                        />
                    </div>
                    <div className="stitch-input-group">
                        <label htmlFor="reg-password">Пароль</label>
                        <input
                            id="reg-password"
                            className="stitch-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'Начать путешествие'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span className="auth-footer-text">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="auth-footer-link">
                            Войти
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
