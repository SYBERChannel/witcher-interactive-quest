import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import audioManager from '../services/AudioManager';

const EndingPage = () => {
    const [finalState, setFinalState] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        audioManager.play('kaer_morhen_theme');
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
        return () => audioManager.fadeOut(2000);
    }, []);

    if (loading) {
        return (
            <div className="ending-page">
                <div className="ending-loading">Хроника подходит к концу...</div>
            </div>
        );
    }

    if (!finalState) {
        return (
            <div className="ending-page">
                <div className="ending-error-state">
                    <p>Не удалось восстановить историю.</p>
                    <button className="btn-secondary" onClick={() => navigate('/')}>Вернуться в Меню</button>
                </div>
            </div>
        );
    }

    const getBranchNarrative = () => {
        if (finalState.branch === 'good') {
            return 'Огни Каэр Морхена угасли, но путь, проложенный через Континент, остался. Когда солнце садится над разбитыми королевствами, рассказы о Ведьмаке звучат в каждой таверне и каждой крепости. Ты выбрал защищать, исцелять и стоять против тьмы. Цири заняла своё место среди легенд, и мир — хоть и измождённый — обрёл мгновение покоя.';
        }
        if (finalState.branch === 'bad') {
            return 'Мороз распространяется от трона Дикой Охоты, преображая мир по твоему образу. Ведьмак, что некогда охотился на чудовищ, теперь командует ими. Королевства трепещут при звуке твоих всадников. Путь власти забрал ещё одного — и Континент никогда не забудет имя Белого Волка, что выбрал власть вместо милосердия.';
        }
        return 'Путь, которым ты прошёл, не был ни светлым, ни тёмным, а чем-то между. Нейтралитет Ведьмака сохранил хрупкое равновесие — ни спаситель, ни тиран, а лишь клинок за плату, чьё молчание говорило громче любого указа. Мир продолжает вращаться, не изменённый твоим прохождением, но навечно отмеченный им.';
    };

    const BRANCH_LABELS = {
        good: 'Путь Света',
        bad: 'Путь Тьмы',
        neutral: 'Нейтральный Путь',
    };

    return (
        <div className="ending-page">
            <div className="ending-content">
                <div className="ending-label">Завершение Хроники</div>
                <h1 className="ending-main-title">Наследие Белого Волка</h1>
                <p className="ending-narrative">{getBranchNarrative()}</p>

                <div className="ending-character-name">
                    {user?.username || 'Геральт из Ривии'}
                </div>

                <div className="ending-stats">
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Выбранный Путь</span>
                        <span className={`ending-stat-value ending-branch--${finalState.branch || 'neutral'}`}>
                            {BRANCH_LABELS[finalState.branch] || BRANCH_LABELS.neutral}
                        </span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Общий Опыт</span>
                        <span className="ending-stat-value">{finalState.xp}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Достигнутый Уровень</span>
                        <span className="ending-stat-value">{finalState.level}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Накоплено Крон</span>
                        <span className="ending-stat-value">{finalState.gold}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Боёв Проведено</span>
                        <span className="ending-stat-value">{finalState.battle_count || 0}</span>
                    </div>
                    <div className="ending-stat-row">
                        <span className="ending-stat-label">Сцен Посещено</span>
                        <span className="ending-stat-value">{(finalState.choices_made || []).length}</span>
                    </div>
                </div>

                <div className="ending-quote">
                    «Ведьмаков создали, чтобы убивать чудовищ. Неважно, кто повесил объявление — монета должна быть правильной.»
                </div>

                <div className="ending-actions">
                    <p className="ending-submitted">Твой результат записан в хрониках.</p>

                    <button onClick={() => navigate('/leaderboard')} className="btn-secondary" style={{ marginBottom: '12px', width: '100%' }}>
                        Таблица Лидеров
                    </button>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Вернуться в Главное Меню
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndingPage;
