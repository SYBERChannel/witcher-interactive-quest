import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-emblem">Континент ждёт</div>
                    <h1 className="auth-title">Вход</h1>
                    <p className="auth-subtitle">Вернись на свой путь, ведьмак</p>
                </div>

                {error && <div className="stitch-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="stitch-input-group">
                        <label htmlFor="login-email">Эл. почта</label>
                        <input
                            id="login-email"
                            className="stitch-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="geralt@kaermorhen.com"
                            required
                        />
                    </div>
                    <div className="stitch-input-group">
                        <label htmlFor="login-password">Пароль</label>
                        <input
                            id="login-password"
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
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span className="auth-footer-text">
                        Ещё нет аккаунта?{' '}
                        <Link to="/register" className="auth-footer-link">
                            Начать путь
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
