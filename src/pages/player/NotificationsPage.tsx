import {useState, useEffect, useRef} from 'react';
import {Box, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Paper, Alert, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GameControllerIcon from '@mui/icons-material/VideogameAsset';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import ConfirmationDialog from '../../components/overlays/ConfirmationDialog.tsx';
import {getCurrentPlayer, getPlayerProfile} from '../../services/player.ts';
import {getGame} from '../../services/game.ts';
import {getPendingInvitations, respondToInvitation} from '../../services/invitation.ts';
import {useNavigate} from 'react-router-dom';

interface NotificationData {
    id: string;
    message: string;
    originalData: any;
}

export default function NotificationsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>([]);
    const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useNavigate();
    const namesCache = useRef<{ [key: string]: string }>({});
    const [playerId, setPlayerId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const player = await getCurrentPlayer();
                setPlayerId(player.playerId);
            } catch {
                setError('Failed to load player data.');
                setLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!playerId) return;

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const invitations = await getPendingInvitations(playerId);

                const formatted = await Promise.all(
                    invitations.map(async (inv: any) => {
                        if (!namesCache.current[inv.inviterId]) {
                            try {
                                const profile = await getPlayerProfile(inv.inviterId);
                                namesCache.current[inv.inviterId] = profile.username || 'Unknown Player';
                            } catch {
                                namesCache.current[inv.inviterId] = 'Unknown Player';
                            }
                        }

                        if (!namesCache.current[inv.gameId]) {
                            try {
                                const game = await getGame(inv.gameId);
                                namesCache.current[inv.gameId] = game.name || 'Unknown Game';
                            } catch {
                                namesCache.current[inv.gameId] = 'Unknown Game';
                            }
                        }

                        const inviterName = namesCache.current[inv.inviterId];
                        const gameName = namesCache.current[inv.gameId];

                        return {
                            id: inv.invitationId,
                            message: `Game Invitation: ${inviterName} has invited you to play ${gameName}`,
                            originalData: inv,
                        };
                    })
                );

                setNotifications(formatted);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
                setError('Failed to load notifications.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [playerId]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredNotifications(notifications);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            setFilteredNotifications(
                notifications.filter((n) => n.message.toLowerCase().includes(lowerQuery))
            );
        }
    }, [searchQuery, notifications]);

    const handleRespond = async (accept: boolean) => {
        if (!selectedInvitation || !playerId) return;

        const invitationId = selectedInvitation.invitationId;
        const url = selectedInvitation.url;
        setSelectedInvitation(null);

        try {
            const response = await respondToInvitation(invitationId, playerId, accept);
            console.log(response);

            setNotifications((prev) => prev.filter((n) => n.id !== invitationId));

            if (accept && response && typeof response === 'object' && 'sessionId' in response) {
                window.location.href = `${url}?mode=friend&sessionId=${response.sessionId}`;
            } else if (accept) {
                window.location.href = `${url}?mode=friend`;
            }
        } catch (err: any) {
            console.error('Failed to respond to invitation:', err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                'Failed to respond to invitation. Please try again.';
            alert(msg);
        }
    };

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => {
            const newState = !prev;
            document.body.classList.toggle('menu-open', newState);
            return newState;
        });
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const unreadCount = notifications.length;

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} notificationCount={unreadCount} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <Box className="notifications-page-content">
                <TextField
                    fullWidth
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="notifications-search-field"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Typography variant="h5" className="notifications-title">
                    Notifications
                </Typography>

                {error && (
                    <Alert severity="error" className="notifications-error-alert" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Paper elevation={3} className="notifications-list-container">
                    {loading ? (
                        <Box className="notifications-loading">
                            <CircularProgress />
                        </Box>
                    ) : filteredNotifications.length > 0 ? (
                        <List>
                            {filteredNotifications.map((notif) => (
                                <ListItem key={notif.id} disablePadding className="notification-item">
                                    <ListItemButton
                                        onClick={() => setSelectedInvitation(notif.originalData)}
                                        className="notification-button"
                                    >
                                        <ListItemAvatar>
                                            <Avatar className="notification-avatar">
                                                <GameControllerIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={notif.message}
                                            className="notification-text"
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box className="notifications-empty">
                            <Typography variant="body1">
                                {searchQuery ? 'No notifications match your search.' : 'No new notifications.'}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>

            {selectedInvitation && (
                <ConfirmationDialog
                    message="Do you want to accept this game invitation?"
                    onConfirm={() => handleRespond(true)}
                    onCancel={() => handleRespond(false)}
                />
            )}
        </Box>
    );
}