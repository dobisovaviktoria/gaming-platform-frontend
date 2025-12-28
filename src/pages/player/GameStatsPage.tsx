import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCurrentPlayer } from '../../services/player.ts';
import { getPlayerGameStats } from '../../services/stats.ts';
import './GameStatsPage.scss';

export default function GameStatsPage() {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();

    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: stats, isLoading } = useQuery({
        queryKey: ['gameStats', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerGameStats(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    const handleBackClick = () => {
        navigate(`/game/${gameId}`);
    };

    if (isLoading) {
        return (
            <div className="game-stats-page">
                <div className="page-header">
                    <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                        ←
                    </button>
                    <h1>Statistics</h1>
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Loading statistics...
                </p>
            </div>
        );
    }

    const winRate = stats && stats.gamesPlayed > 0
        ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
        : '0.0';

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>Statistics</h1>
            </div>

            <div className="stats-section">
                <h2>My Statistics</h2>

                {!stats || stats.gamesPlayed === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                        No games played yet. Start playing to see your statistics!
                    </p>
                ) : (
                    <div className="stats-list">
                        <div className="stat-item">
                            <div className="stat-icon">🎮</div>
                            <div className="stat-info">
                                <span className="stat-label">Games Played</span>
                                <span className="stat-value">{stats.gamesPlayed}</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-info">
                                <span className="stat-label">Wins</span>
                                <span className="stat-value">{stats.wins}</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">❌</div>
                            <div className="stat-info">
                                <span className="stat-label">Losses</span>
                                <span className="stat-value">{stats.losses}</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <span className="stat-label">Win Rate</span>
                                <span className="stat-value">{winRate}%</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-info">
                                <span className="stat-label">Current Win Streak</span>
                                <span className="stat-value">{stats.currentWinStreak}</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">⭐</div>
                            <div className="stat-info">
                                <span className="stat-label">Total Score</span>
                                <span className="stat-value">{stats.totalScore}</span>
                            </div>
                        </div>

                        {stats.totalKills > 0 && (
                            <div className="stat-item">
                                <div className="stat-icon">⚔️</div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Kills</span>
                                    <span className="stat-value">{stats.totalKills}</span>
                                </div>
                            </div>
                        )}

                        {stats.perfectGames > 0 && (
                            <div className="stat-item">
                                <div className="stat-icon">💎</div>
                                <div className="stat-info">
                                    <span className="stat-label">Perfect Games</span>
                                    <span className="stat-value">{stats.perfectGames}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};