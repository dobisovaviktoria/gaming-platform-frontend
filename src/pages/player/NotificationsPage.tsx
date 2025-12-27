import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import Notification from '../components/Notification';
import ConfirmationDialog from '../components/overlays/ConfirmationDialog.tsx';
import './NotificationsPage.scss';
import { useSearch } from "../hooks/useSearch.ts";
import { getCurrentPlayer, getPlayerProfile } from '../services/player';
import { getGame } from '../services/game';
import { getPendingInvitations, respondToInvitation, type InvitationResponse } from '../services/invitation';
import { useNavigate } from 'react-router-dom';

interface NotificationData {
    id: string;
    message: string;
    icon?: string;
    originalData?: InvitationResponse;
}

export default function NotificationsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [internalPlayerId, setInternalPlayerId] = useState<string | null>(null);
    const [selectedInvitation, setSelectedInvitation] = useState<InvitationResponse | null>(null);
    const navigate = useNavigate();

    const namesCache = useRef<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                let playerId = internalPlayerId;
                if (!playerId) {
                    const player = await getCurrentPlayer();
                    playerId = player.playerId;
                    setInternalPlayerId(playerId);
                }

                if (playerId) {
                    const invitations = await getPendingInvitations(playerId);
                    
                    const formattedNotifications = await Promise.all(invitations.map(async (inv) => {
                        if (!namesCache.current[inv.inviterId]) {
                            try {
                                const profile = await getPlayerProfile(inv.inviterId);
                                namesCache.current[inv.inviterId] = profile.username;
                            } catch {
                                namesCache.current[inv.inviterId] = 'Unknown Player';
                            }
                        }

                        if (!namesCache.current[inv.gameId]) {
                            try {
                                const game = await getGame(inv.gameId);
                                namesCache.current[inv.gameId] = game.name;
                            } catch {
                                namesCache.current[inv.gameId] = 'Unknown Game';
                            }
                        }

                        const inviterName = namesCache.current[inv.inviterId];
                        const gameName = namesCache.current[inv.gameId];

                        return {
                            id: inv.invitationId,
                            message: `Game Invitation: ${inviterName} has invited you to play ${gameName}`,
                            icon: '🎮',
                            originalData: inv
                        };
                    }));
                    
                    setNotifications(formattedNotifications);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };

        fetchNotifications();
        
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [internalPlayerId]);

    useEffect(() => {
        console.log('Selected Invitation State Changed:', selectedInvitation);
    }, [selectedInvitation]);

    useEffect(() => {
        console.log('Notifications List Updated:', notifications);
    }, [notifications]);

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<NotificationData>({
        data: notifications,
        searchField: 'message',
    });

    const handleNotificationClick = (id: string) => {
        console.log('Notification clicked:', id);
        const notification = notifications.find(n => n.id === id);
        if (notification?.originalData) {
            console.log('Clicked Invitation Details:', notification.originalData);
            setSelectedInvitation(notification.originalData);
        }
    };

    const handleRespond = async (accept: boolean) => {
        if (!selectedInvitation || !internalPlayerId) return;

        try {
            console.log(`Responding to invitation ${selectedInvitation.invitationId} with accept=${accept}`);
            const response = await respondToInvitation(selectedInvitation.invitationId, internalPlayerId, accept);
            console.log('Response result:', response);

            setNotifications(prev => prev.filter(n => n.id !== selectedInvitation.invitationId));
            setSelectedInvitation(null);

            if (accept && response && typeof response === 'object' && 'sessionId' in response) {
                console.log('Invitation accepted, navigating to game session:', response.sessionId);
                navigate(`/game/${response.gameId}/play?mode=friend&sessionId=${response.sessionId}`);
            }
        } catch (error) {
            console.error("Failed to respond to invitation:", error);
            alert("Failed to respond to invitation.");
            setSelectedInvitation(null);
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="page">
            <Navbar
                onMenuToggle={handleMenuToggle}
            />

            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            <div className="search-results">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No results found</h2>
                        <p>Try again...</p>
                    </div>
                )}

                {searchResults.length > 0 ? (
                    <div className="notifications-list">
                        {searchResults.map((notification) => (
                            <Notification
                                key={notification.id}
                                message={notification.message}
                                icon={notification.icon}
                                onClick={() => handleNotificationClick(notification.id)}
                            />
                        ))}
                    </div>
                ) : (
                    !isLoading && !searchQuery && <div className="no-results"><p>No new notifications.</p></div>
                )}
            </div>

            {selectedInvitation && (
                <ConfirmationDialog
                    message="Do you want to accept this game invitation?"
                    onConfirm={() => handleRespond(true)}
                    onCancel={() => handleRespond(false)}
                />
            )}
        </div>
    );
};