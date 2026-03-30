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
                    <div className="auth-emblem">Forge Your Legend</div>
                    <h1 className="auth-title">Create Chronicle</h1>
                    <p className="auth-subtitle">Every witcher must begin somewhere</p>
                </div>

                {error && <div className="stitch-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="stitch-input-group">
                        <label htmlFor="reg-username">Witcher Name</label>
                        <input
                            id="reg-username"
                            className="stitch-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Geralt of Rivia"
                            required
                        />
                    </div>
                    <div className="stitch-input-group">
                        <label htmlFor="reg-email">Email</label>
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
                        <label htmlFor="reg-password">Password</label>
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
                        {loading ? 'Forging...' : 'Begin the Journey'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span className="auth-footer-text">
                        Already chronicled?{' '}
                        <Link to="/login" className="auth-footer-link">
                            Return to sign in
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
