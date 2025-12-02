import React, { useState } from 'react';
import './GameLobbyOverlay.scss';

interface Player {
    id: string;
    username: string;
    avatarUrl: string;
    status: 'waiting' | 'ready' | 'invited' | 'not-invited';
}

interface GameLobbyOverlayProps {
    isOpen: boolean;
    url: string;
    gameName: string;
    maxPlayers: number;
    onClose: () => void;
    onStartGame: () => void;
}

const GameLobbyOverlay: React.FC<GameLobbyOverlayProps> = ({
                                                               isOpen,
                                                               url,
                                                               gameName,
                                                               maxPlayers,
                                                               onClose
                                                           }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [waitingPlayers, setWaitingPlayers] = useState<Player[]>([
        {
            id: '1',
            username: 'Brittany Dinan',
            avatarUrl: '/avatars/brittany1.jpg',
            status: 'waiting',
        },
    ]);

    // Mock searchable players list
    const [allPlayers] = useState<Player[]>([
        {
            id: '2',
            username: 'Brittany Dinan',
            avatarUrl: '/avatars/brittany2.jpg',
            status: 'not-invited',
        },
        {
            id: '3',
            username: 'John Smith',
            avatarUrl: '/avatars/john.jpg',
            status: 'not-invited',
        },
        {
            id: '4',
            username: 'Sarah Johnson',
            avatarUrl: '/avatars/sarah.jpg',
            status: 'not-invited',
        },
        {
            id: '5',
            username: 'Mike Wilson',
            avatarUrl: '/avatars/mike.jpg',
            status: 'not-invited',
        },
        {
            id: '6',
            username: 'Emily Brown',
            avatarUrl: '/avatars/emily.jpg',
            status: 'not-invited',
        },
    ]);

    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);

    const currentPlayerCount = waitingPlayers.length + invitedPlayers.filter(p => p.status === 'invited').length;

    // Filter players based on search query
    const filteredPlayers = allPlayers.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !waitingPlayers.some(wp => wp.id === player.id) // Exclude already waiting players
    );

    const handleInviteToggle = (player: Player) => {
        const isInvited = invitedPlayers.some(p => p.id === player.id);

        if (isInvited) {
            // Uninvite player
            setInvitedPlayers(prev => prev.filter(p => p.id !== player.id));
        } else {
            // Invite player
            if (currentPlayerCount < maxPlayers) {
                setInvitedPlayers(prev => [...prev, { ...player, status: 'invited' }]);
            } else {
                alert(`Maximum ${maxPlayers} players allowed!`);
            }
        }
    };

    const handleAddRandom = () => {
        // Invite player
        if (currentPlayerCount < maxPlayers) {
            setWaitingPlayers([...waitingPlayers, {
                id: Math.floor(Math.random() * 1000)+"",
                username: 'Brittany Dinan',
                avatarUrl: '/avatars/brittany1.jpg',
                status: 'waiting',
            },])
        } else {
            alert(`Maximum ${maxPlayers} players allowed!`);
        }
    };

    const handleStart = () => {
        if (waitingPlayers.length === maxPlayers) window.location.href = url;
    };

    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="title">Lobby</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="overlay-content">
                    <h2 className="game-title">{gameName}</h2>

                    <div className="waiting-section">
                        <div className="section-header">
                            <span className="section-label">Waiting</span>
                            <span className="player-count">{currentPlayerCount}/{maxPlayers} Players</span>
                        </div>

                        <div className="waiting-players">
                            {waitingPlayers.map((player) => (
                                <div key={player.id} className="player-item">
                                    <div className="player-avatar">
                                        <img src={player.avatarUrl} alt={player.username} />
                                        <div className="loading-indicator">⏳</div>
                                    </div>
                                    <span className="player-name">{player.username}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <div className="invited-section">
                        {filteredPlayers.map((player) => {
                            const isInvited = invitedPlayers.some(p => p.id === player.id);

                            return (
                                <div key={player.id} className="invited-player">
                                    <div className="player-info">
                                        <div className="player-avatar-small">
                                            <img src={player.avatarUrl} alt={player.username} />
                                        </div>
                                        <span className="player-name">{player.username}</span>
                                    </div>
                                    <button
                                        className={`invite-btn `}
                                        onClick={() => handleInviteToggle(player)}
                                        aria-label={isInvited ? 'Uninvite player' : 'Invite player'}
                                    >
                                        <span className="status-icon">
                                          {isInvited ? '⏳' : '✉️'}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}

                        {filteredPlayers.length === 0 && searchQuery && (
                            <div className="no-results">
                                <p>No players found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>

                    <div className="buttons">
                        <button className="btn btn-add-random" onClick={handleAddRandom}>
                            Add Random People
                        </button>
                        <button className="btn btn-start" onClick={handleStart}>
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameLobbyOverlay;
