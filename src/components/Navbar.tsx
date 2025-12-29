import {Box, IconButton, Avatar, Badge, Paper} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from 'react-router-dom';

interface NavbarProps {
    onMenuToggle: () => void;
    notificationCount?: number;
}

export default function Navbar({onMenuToggle, notificationCount = 0}: NavbarProps) {
    const navigate = useNavigate();

    return (
        <Paper elevation={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <IconButton onClick={() => navigate('/notifications')} size="large">
                    <Badge badgeContent={notificationCount} color="error" overlap="circular">
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