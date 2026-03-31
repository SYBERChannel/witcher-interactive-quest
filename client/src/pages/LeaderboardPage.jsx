import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../api/leaderboard.api';
import useAuthStore from '../store/authStore';

const BRANCH_LABELS = {
    good: 'Свет',
    bad: 'Тьма',
    neutral: 'Нейтралитет',
};

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        let isMounted = true;

        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                if (isMounted) {
                    const entries = data?.data?.leaderboard || data?.leaderboard || (Array.isArray(data) ? data : []);
                    setLeaders(entries);
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError('Не удалось загрузить таблицу лидеров');
                    setLeaders([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchLeaderboard();
        return () => { isMounted = false; };
    }, []);

    const getBranchClass = (branch) => {
        if (branch === 'good') return 'leaderboard-branch leaderboard-branch--good';
        if (branch === 'bad') return 'leaderboard-branch leaderboard-branch--bad';
        return 'leaderboard-branch leaderboard-branch--neutral';
    };

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-header">
                <Link to="/" className="leaderboard-back">Назад в Меню</Link>
                <h1 className="leaderboard-title">Таблица Лидеров</h1>
                <p className="leaderboard-subtitle">Лучшие ведьмаки Континента</p>
            </div>

            {error && (
                <div className="leaderboard-warning">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="leaderboard-loading">Загрузка хроник...</div>
            ) : leaders.length === 0 ? (
                <div className="leaderboard-empty">Записей пока нет. Пройди игру, чтобы стать первым!</div>
            ) : (
                <div className="leaderboard-content">
                    <div className="leaderboard-table-wrapper">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Ранг</th>
                                    <th>Ведьмак</th>
                                    <th>Уровень</th>
                                    <th>Опыт</th>
                                    <th>Сцен</th>
                                    <th>Побед</th>
                                    <th>Путь</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaders.map((leader, index) => {
                                    const isCurrentUser = user && user.username === leader.username;
                                    const rankClass = index < 3 ? 'leaderboard-rank leaderboard-rank--top' : 'leaderboard-rank';
                                    return (
                                        <tr
                                            key={leader.id || index}
                                            className={isCurrentUser ? 'leaderboard-row--self' : ''}
                                        >
                                            <td>
                                                <span className={rankClass}>{index + 1}</span>
                                            </td>
                                            <td>
                                                <span className="leaderboard-username">{leader.username}</span>
                                            </td>
                                            <td>{leader.level}</td>
                                            <td>{leader.total_xp || leader.xp}</td>
                                            <td>{leader.scenes_visited ?? '—'}</td>
                                            <td>{leader.battles_won ?? '—'}</td>
                                            <td>
                                                <span className={getBranchClass(leader.branch)}>
                                                    {BRANCH_LABELS[leader.branch] || leader.branch}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardPage;
