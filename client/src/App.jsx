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

function App() {
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
