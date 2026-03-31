import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainMenuPage from './pages/MainMenuPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import ProtectedRoute from './components/UI/ProtectedRoute';
import './App.css';

import BattlePage from './pages/BattlePage';
import EndingPage from './pages/EndingPage';
import { AudioProvider } from './context/AudioContext';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import { refreshToken } from './api/auth.api';

function App() {
    const [isRestoring, setIsRestoring] = useState(true);
    const setAccessToken = useAuthStore(state => state.setAccessToken);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                // If we have a refresh cookie, this will return a new accessToken
                const response = await refreshToken();
                if (response?.data?.accessToken) {
                    setAccessToken(response.data.accessToken);
                }
            } catch (err) {
                // No session or expired, nothing to restore
            } finally {
                setIsRestoring(false);
            }
        };

        restoreSession();
    }, [setAccessToken]);

    if (isRestoring) {
        return (
            <div className="flex items-center justify-center h-screen bg-surface-container-lowest">
                <div className="text-primary font-headline tracking-widest animate-pulse">
                    ВОССТАНОВЛЕНИЕ ПУТИ...
                </div>
            </div>
        );
    }

    return (
        <AudioProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/leaderboard" element={<LeaderboardPage />} />

                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <MainMenuPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/game"
                            element={
                                <ProtectedRoute>
                                    <GamePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/shop"
                            element={
                                <ProtectedRoute>
                                    <ShopPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/battle/:id"
                            element={
                                <ProtectedRoute>
                                    <BattlePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/ending"
                            element={
                                <ProtectedRoute>
                                    <EndingPage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AudioProvider>
    );
}

export default App;
