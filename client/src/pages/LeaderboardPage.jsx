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
                    // Mock data fallback
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

    return (
        <div className="leaderboard-page">
            <header style={{ marginBottom: '2rem' }}>
                <Link to="/">Back to Menu</Link>
                <h1>Leaderboard</h1>
            </header>

            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'orange', marginBottom: '1rem' }}>{error} (Showing mock data)</div>}

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444' }}>
                            <th style={{ padding: '0.5rem' }}>Rank</th>
                            <th style={{ padding: '0.5rem' }}>Witcher</th>
                            <th style={{ padding: '0.5rem' }}>Level</th>
                            <th style={{ padding: '0.5rem' }}>XP</th>
                            <th style={{ padding: '0.5rem' }}>Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.map((leader, index) => {
                            const isCurrentUser = user && user.username === leader.username;
                            return (
                                <tr
                                    key={leader.id || index}
                                    style={{
                                        borderBottom: '1px solid #333',
                                        backgroundColor: isCurrentUser ? 'rgba(212, 175, 55, 0.1)' : 'transparent'
                                    }}
                                >
                                    <td style={{ padding: '0.5rem', color: isCurrentUser ? '#d4af37' : 'inherit' }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ padding: '0.5rem', fontWeight: isCurrentUser ? 'bold' : 'normal' }}>
                                        {leader.username}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>{leader.level}</td>
                                    <td style={{ padding: '0.5rem' }}>{leader.xp}</td>
                                    <td style={{ padding: '0.5rem' }}>{leader.branch}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardPage;
