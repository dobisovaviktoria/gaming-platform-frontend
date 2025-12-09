import { useState } from 'react';
import './AdmingGamesPage.scss';

interface Game {
    id: string;
    title: string;
    user: string;
    status: 'pending';
}

export default function AdminGamesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // Sample pending games - replace with actual data
    const games: Game[] = [
        { id: '1', title: 'TicTacToe', user: 'US', status: 'pending' },
        { id: '2', title: 'Chess', user: 'Teachers', status: 'pending' },
        { id: '3', title: 'Connect 4', user: 'Jip', status: 'pending' },
        { id: '4', title: 'Minesweeper', user: 'Janneke', status: 'pending' },
    ];

    const handleApprove = (gameId: string) => {
        console.log('Approving game:', gameId);
    };

    const handleReject = (gameId: string) => {
        console.log('Rejecting game:', gameId);
    };

    return (
        <div className="page pending-games">
            <div className="page-header">
                <h1>Pending Games</h1>

                <div className="header-actions">
                    <button className="notification-btn" aria-label="Notifications">
                        🔔
                    </button>

                    <div className="user-avatar">
                        <img src="/path-to-avatar.jpg" alt="User" />
                    </div>

                    <button className="menu-btn" aria-label="Menu">
                        ☰
                    </button>
                </div>
            </div>

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <main className="games-content">
                <h2 className="section-title">Games</h2>

                <div className="games-list">
                    {games.map((game) => (
                        <div key={game.id} className="game-item">
                            <div className="game-info">
                <span className="game-players">
                  {game.title} by {game.user}
                </span>
                            </div>

                            <div className="game-actions">
                                <button
                                    className="btn-approve"
                                    onClick={() => handleApprove(game.id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleReject(game.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
