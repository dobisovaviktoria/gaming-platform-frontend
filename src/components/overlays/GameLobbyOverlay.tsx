import {useEffect, useState} from 'react';
import './GameLobbyOverlay.scss';
import {useKeycloak} from '../../contexts/AuthContext';
import {getFriends, getCurrentPlayer} from '../../services/player';
import {joinLobby, checkLobbyStatus} from '../../services/lobby';
import {sendInvitation, getInvitationStatus} from '../../services/invitation';
import {useNavigate} from "react-router-dom";

interface Player {
    id: string;
    username: string;
    avatarUrl: string;
    status: 'waiting' | 'ready' | 'invited' | 'not-invited';
}

interface GameLobbyOverlayProps {
    isOpen: boolean;
    gameName: string;
    gameId: string; 
    maxPlayers: number;
    onClose: () => void;
}

export default function GameLobbyOverlay({isOpen, gameName, gameId, maxPlayers, onClose}: GameLobbyOverlayProps) {
    const { user } = useKeycloak();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [waitingPlayers, setWaitingPlayers] = useState<Player[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [isWaitingForMatch, setIsWaitingForMatch] = useState(false);
    const [isWaitingForInvitation, setIsWaitingForInvitation] = useState(false);
    const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            console.log('Current Logged-in User (Keycloak):', user);
            setWaitingPlayers([
                {
                    id: user.sub, 
                    username: user.preferred_username,
                    avatarUrl: user.avatarUrl || '/avatars/default.jpg', 
                    status: 'waiting',
                },
            ]);
        }
    }, [user]);

    useEffect(() => {
        const fetchInternalPlayer = async () => {
            if (user) {
                try {
                    const player = await getCurrentPlayer();
                    console.log('Current Player (Backend):', player);
                } catch (error) {
                    console.error('Failed to fetch internal player profile:', error);
                }
            }
        };
        fetchInternalPlayer();
    }, [user]);

    useEffect(() => {
        const fetchFriends = async () => {
            if (user) {
                setIsLoadingFriends(true);
                try {
                    const friends = await getFriends();
                    console.log('Fetched Friends:', friends);
                    const friendPlayers: Player[] = friends.map(friend => ({
                        id: friend.playerId,
                        username: friend.username,
                        avatarUrl: '/avatars/default.jpg', 
                        status: 'not-invited',
                    }));
                    setAllPlayers(friendPlayers);
                } catch (error) {
                    console.error('Failed to fetch friends:', error);
                    setAllPlayers([]);
                } finally {
                    setIsLoadingFriends(false);
                }
            }
        };

        fetchFriends();
    }, [user]);

    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);

    const currentPlayerCount = waitingPlayers.length + invitedPlayers.length;

    const filteredPlayers = allPlayers.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !waitingPlayers.some(wp => wp.id === player.id) && 
        !invitedPlayers.some(ip => ip.id === player.id) 
    );

    const handleInviteToggle = async (friend: Player) => {
        console.log(`Attempting to invite friend: ${friend.username} (ID: ${friend.id})`);
        
        try {

            const inviter = await getCurrentPlayer();
            const inviterId = inviter.playerId;
            const inviteeId = friend.id;

            const response = await sendInvitation(inviterId, inviteeId, gameId);
            
            console.log('Invitation sent successfully:', response);
            
            setInvitedPlayers(prev => [...prev, { ...friend, status: 'invited' }]);
            
            setPendingInvitationId(response.invitationId);
            setIsWaitingForInvitation(true);
            
        } catch (error) {
            console.error('Failed to send invitation:', error);
            alert('Failed to send invitation. Check console for details.');
        }
    };

    const handleJoinLobby = async () => {
        if (!user || !user.sub) {
            alert('User not authenticated.');
            return;
        }

        try {
            const response = await joinLobby({ gameId });
            if (response.status === 'WAITING') {
                setIsWaitingForMatch(true);
            } else if (response.status === 'MATCHED' && response.sessionId) {
                navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
            }
        } catch (error) {
            console.error('Failed to join lobby:', error);

            alert(`Failed to join lobby: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    useEffect(() => {
        let pollingInterval: number;

        if (isWaitingForMatch) {
            pollingInterval = setInterval(async () => {
                try {
                    const response = await checkLobbyStatus(gameId);
                    if (response.status === 'MATCHED' && response.sessionId) {
                        setIsWaitingForMatch(false);
                        clearInterval(pollingInterval);
                        navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
                    } else if (response.status === 'WAITING') {
                        // Continue waiting - polling will check again
                    }
                } catch (error) {
                    console.error('Failed to check lobby status:', error);
                    clearInterval(pollingInterval);
                    setIsWaitingForMatch(false);
                }
            }, 2000);
        }

        return () => {
            clearInterval(pollingInterval);
        };
    }, [isWaitingForMatch, gameId, onClose, navigate]);

    useEffect(() => {
        let pollingInterval: number;

        if (isWaitingForInvitation && pendingInvitationId) {
            pollingInterval = setInterval(async () => {
                try {
                    const response = await getInvitationStatus(pendingInvitationId);
                    if (response.status === 'ACCEPTED' && response.sessionId) {
                        setIsWaitingForInvitation(false);
                        setPendingInvitationId(null);
                        clearInterval(pollingInterval);
                        console.log('Invitation accepted! Navigating to game...');
                        navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
                    } else if (response.status === 'REJECTED') {
                        setIsWaitingForInvitation(false);
                        setPendingInvitationId(null);
                        clearInterval(pollingInterval);
                        alert('Your invitation was rejected.');
                    } else {
                        console.log('Waiting for invitation response...');
                    }
                } catch (error) {
                    console.error('Failed to check invitation status:', error);
                    clearInterval(pollingInterval);
                    setIsWaitingForInvitation(false);
                }
            }, 2000);
        }

        return () => {
            clearInterval(pollingInterval);
        };
    }, [isWaitingForInvitation, pendingInvitationId, gameId, navigate]);


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
                            {invitedPlayers.map((player) => (
                                <div key={player.id} className="player-item">
                                    <div className="player-avatar">
                                        <img src={player.avatarUrl} alt={player.username} />
                                        <div className="loading-indicator">✉️</div>
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
                        {isLoadingFriends ? (
                            <div className="loading-friends">Loading friends...</div>
                        ) : filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player) => {
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
                                            className={`invite-btn ${isInvited ? 'invited' : ''}`}
                                            onClick={() => handleInviteToggle(player)}
                                            aria-label={isInvited ? 'Uninvite player' : 'Invite player'}
                                        >
                                            <span className="status-icon">
                                                {isInvited ? '✅' : '✉️'}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-results">
                                <p>No friends found.</p>
                            </div>
                        )}

                        {filteredPlayers.length === 0 && searchQuery && !isLoadingFriends && (
                            <div className="no-results">
                                <p>No players found matching "{searchQuery}"</p>
                            </div>
                        )}
                    </div>

                    <div className="buttons">
                        <button
                            className="btn btn-start"
                            onClick={handleJoinLobby}
                            disabled={isWaitingForMatch || currentPlayerCount === 0}
                        >
                            {isWaitingForMatch ? 'Waiting in Lobby' : 'Join Lobby'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};