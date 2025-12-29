import {useState} from 'react';
import {Box, Typography, Avatar, Stack, Paper, CircularProgress, Alert} from '@mui/material';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import {useQuery} from '@tanstack/react-query';
import {getCurrentPlayer} from '../../services/player.ts';

export default function ProfilePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {
        data: player,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['currentPlayer'],
        queryFn: getCurrentPlayer,
    });

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

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !player) {
        return (
            <Box p={4} textAlign="center">
                <Alert severity="error">
                    Failed to load profile. Please try again later.
                </Alert>
            </Box>
        );
    }

    const avatarLetter = player.username.charAt(0).toUpperCase();

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <Box className="profile-page-container">
                <Paper elevation={6} className="profile-card">
                    <Box className="profile-card-content">
                        <Stack spacing={4} alignItems="center">
                            <Avatar className="profile-avatar">
                                {avatarLetter}
                            </Avatar>

                            <Typography variant="h5" className="profile-username">
                                {player.username}
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}