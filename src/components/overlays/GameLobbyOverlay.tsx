import {useEffect, useState} from 'react';
import {Dialog, DialogTitle, DialogContent, Button, Typography, Box, IconButton, Stack, Avatar, TextField, InputAdornment, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, ListItemButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useKeycloak} from '../../contexts/AuthContext';
import {getFriends, getCurrentPlayer} from '../../services/player';
import {joinLobby, checkLobbyStatus} from '../../services/lobby';
import {sendInvitation, getInvitationStatus} from '../../services/invitation';
import {useNavigate} from 'react-router-dom';

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
    const [invitedPlayers, setInvitedPlayers] = useState<Player[]>([]);
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [isWaitingForMatch, setIsWaitingForMatch] = useState(false);
    const [isWaitingForInvitation, setIsWaitingForInvitation] = useState(false);
    const [pendingInvitationId, setPendingInvitationId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
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
        const fetchFriends = async () => {
            if (user) {
                try {
                    const friends = await getFriends();
                    const friendPlayers: Player[] = friends.map((friend) => ({
                        id: friend.playerId,
                        username: friend.username,
                        avatarUrl: '/avatars/default.jpg',
                        status: 'not-invited',
                    }));
                    setAllPlayers(friendPlayers);
                } catch (error) {
                    console.error('Failed to fetch friends:', error);
                }
            }
        };
        fetchFriends();
    }, [user]);

    const currentPlayerCount = waitingPlayers.length + invitedPlayers.length;

    const filteredPlayers = allPlayers.filter(
        (player) =>
            player.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !waitingPlayers.some((wp) => wp.id === player.id) &&
            !invitedPlayers.some((ip) => ip.id === player.id)
    );

    const handleInviteToggle = async (friend: Player) => {
        try {
            const inviter = await getCurrentPlayer();
            const response = await sendInvitation(inviter.playerId, friend.id, gameId);
            setInvitedPlayers((prev) => [...prev, { ...friend, status: 'invited' }]);
            setPendingInvitationId(response.invitationId);
            setIsWaitingForInvitation(true);
        } catch (error) {
            console.error('Failed to send invitation:', error);
        }
    };

    const handleJoinLobby = async () => {
        try {
            const response = await joinLobby({ gameId });
            if (response.status === 'WAITING') {
                setIsWaitingForMatch(true);
            } else if (response.status === 'MATCHED' && response.sessionId) {
                navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
            }
        } catch (error) {
            console.error('Failed to join lobby:', error);
        }
    };

    useEffect(() => {
        let interval: number;
        if (isWaitingForMatch) {
            interval = setInterval(async () => {
                try {
                    const response = await checkLobbyStatus(gameId);
                    if (response.status === 'MATCHED' && response.sessionId) {
                        setIsWaitingForMatch(false);
                        clearInterval(interval);
                        navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
                    }
                } catch (error) {
                    console.error('Lobby status check failed:', error);
                    clearInterval(interval);
                    setIsWaitingForMatch(false);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isWaitingForMatch, gameId, navigate]);

    useEffect(() => {
        let interval: number;
        if (isWaitingForInvitation && pendingInvitationId) {
            interval = setInterval(async () => {
                try {
                    const response = await getInvitationStatus(pendingInvitationId);
                    if (response.status === 'ACCEPTED' && response.sessionId) {
                        setIsWaitingForInvitation(false);
                        setPendingInvitationId(null);
                        clearInterval(interval);
                        navigate(`/game/${gameId}/play?mode=friend&sessionId=${response.sessionId}`);
                    } else if (response.status === 'REJECTED') {
                        setIsWaitingForInvitation(false);
                        setPendingInvitationId(null);
                        clearInterval(interval);
                    }
                } catch (error) {
                    console.error('Invitation status check failed:', error);
                    clearInterval(interval);
                    setIsWaitingForInvitation(false);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isWaitingForInvitation, pendingInvitationId, gameId, navigate]);

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Lobby</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                    <Typography variant="h5" align="center">
                        {gameName}
                    </Typography>

                    <Box>
                        <Typography variant="subtitle1">
                            Waiting ({currentPlayerCount}/{maxPlayers})
                        </Typography>
                        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                            {waitingPlayers.map((player) => (
                                <Box key={player.id} textAlign="center" position="relative">
                                    <Avatar src={player.avatarUrl} alt={player.username} />
                                    <CircularProgress
                                        size={24}
                                        thickness={4}
                                        sx={{position: 'absolute', top: '50%', left: '50%', mt: -1.5, ml: -1.5}}
                                    />
                                    <Typography variant="caption" mt={1}>
                                        {player.username}
                                    </Typography>
                                </Box>
                            ))}
                            {invitedPlayers.map((player) => (
                                <Box key={player.id} textAlign="center" position="relative">
                                    <Avatar src={player.avatarUrl} alt={player.username} />
                                    <MailIcon
                                        fontSize="small"
                                        sx={{position: 'absolute', top: '50%', left: '50%', mt: -1.5, ml: -1.5}}
                                    />
                                    <Typography variant="caption" mt={1}>
                                        {player.username}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <TextField
                        fullWidth
                        placeholder="Search friends"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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

                    <List>
                        {filteredPlayers.map((player) => {
                            const isInvited = invitedPlayers.some((p) => p.id === player.id);
                            return (
                                <ListItem key={player.id} disablePadding>
                                    <ListItemButton onClick={() => handleInviteToggle(player)}>
                                        <ListItemAvatar>
                                            <Avatar src={player.avatarUrl} />
                                        </ListItemAvatar>
                                        <ListItemText primary={player.username} />
                                        {isInvited ? <CheckCircleIcon color="success" /> : <MailIcon />}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Stack>
            </DialogContent>

            <Box p={2}>
                <Button
                    variant="contained"
                    onClick={handleJoinLobby}
                    disabled={isWaitingForMatch || currentPlayerCount === 0}
                    fullWidth
                    size="large"
                >
                    {isWaitingForMatch ? 'Waiting in Lobby' : 'Join Lobby'}
                </Button>
            </Box>
        </Dialog>
    );
}