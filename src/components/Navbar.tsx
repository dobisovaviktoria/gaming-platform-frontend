import {Box, IconButton, Avatar, Badge, Paper} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";
import {getPendingInvitations, type InvitationResponse} from "../services/invitation.ts";
import {getCurrentPlayer} from "../services/player.ts";

interface NavbarProps {
    onMenuToggle: () => void;
}

export default function Navbar({onMenuToggle}: NavbarProps) {
    const navigate = useNavigate();
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<InvitationResponse[]>([]);

    useEffect(() => {
        const init = async () => {
            try {
                const player = await getCurrentPlayer();
                setPlayerId(player.playerId);
            } catch {
                console.log("Error getting player");
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!playerId) return;

        const fetchNotifications = async () => {
            try {
                const invitations = await getPendingInvitations(playerId);
                setNotifications(invitations);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [playerId]);

    return (
        <Paper elevation={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <IconButton onClick={() => navigate('/notifications')} size="large">
                    <Badge badgeContent={notifications.length} color="error" overlap="circular">
                        <NotificationsIcon fontSize="large" />
                    </Badge>
                </IconButton>

                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar />
                    <IconButton onClick={onMenuToggle} size="large">
                        <MenuIcon fontSize="large" />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
}