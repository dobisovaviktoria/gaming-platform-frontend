import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GameStatsPage.scss';

interface GameStats {
    fastestGame: string;
    wins: number;
    losses: number;
    draws: number;
}

const GameStatsPage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();

    // Mock data - replace with API call based on gameId
    const stats: GameStats = {
        fastestGame: '1:23',
        wins: 42,
        losses: 15,
        draws: 8,
    };

    const handleBackClick = () => {
        navigate(`/game/${gameId}`);
    };

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

                <div className="stats-list">
                    <div className="stat-item">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-info">
                            <span className="stat-label">Fastest Game</span>
                            <span className="stat-value">{stats.fastestGame}</span>
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
                        <div className="stat-icon">🤝</div>
                        <div className="stat-info">
                            <span className="stat-label">Draws</span>
                            <span className="stat-value">{stats.draws}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameStatsPage;
