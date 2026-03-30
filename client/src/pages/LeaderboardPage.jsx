import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../api/leaderboard.api';
import useAuthStore from '../store/authStore';

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
                    setLeaders(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setError('Failed to load leaderboard');
                    setLeaders([
                        { id: 1, username: 'Geralt_Rivia', xp: 5000, level: 10, branch: 'good' },
                        { id: 2, username: 'Vesemir_Old', xp: 4500, level: 9, branch: 'neutral' },
                        { id: 3, username: 'Yennefer_V', xp: 4200, level: 9, branch: 'bad' },
                    ]);
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
                <Link to="/" className="leaderboard-back">Back to Menu</Link>
                <h1 className="leaderboard-title">Leaderboard</h1>
                <p className="leaderboard-subtitle">The finest witchers across the Continent</p>
            </div>

            {error && (
                <div className="leaderboard-warning">
                    {error} — Showing fallback data
                </div>
            )}

            {loading ? (
                <div className="leaderboard-loading">Loading chronicles...</div>
            ) : leaders.length === 0 ? (
                <div className="leaderboard-empty">No records found</div>
            ) : (
                <div className="leaderboard-content">
                    <div className="leaderboard-table-wrapper">
                        <table className="leaderboard-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Witcher</th>
                                    <th>Level</th>
                                    <th>XP</th>
                                    <th>Path</th>
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
                                            <td>{leader.xp}</td>
                                            <td>
                                                <span className={getBranchClass(leader.branch)}>
                                                    {leader.branch}
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
