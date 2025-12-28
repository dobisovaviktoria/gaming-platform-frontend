import {useState} from 'react';
import {Link} from "react-router-dom";
import {Box, Typography, Button, Stack, Paper} from '@mui/material';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';

export default function AddGamePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box p={3} maxWidth="lg" mx="auto">
                <Typography variant="h4" mb={4}>How to Add a Game?</Typography>

                <Paper elevation={3}>
                    <Box p={4}>
                        <Stack spacing={3}>
                            <Typography variant="body1">
                                To add a new game to the platform, you need to follow these steps and ensure
                                your game meets our requirements.
                            </Typography>
                            <Typography variant="body1">
                                First, make sure your game is compatible with our platform. Games should be
                                web-based and follow our API guidelines for player management and game state.
                            </Typography>
                            <Typography variant="body1">
                                You'll need to provide the following information: game name, redirection url,
                                thumbnail image, description, rules, number of players.
                            </Typography>
                            <Typography variant="body1">
                                The game should implement our authentication system and handle player sessions
                                properly. Review our developer documentation for detailed integration steps.
                            </Typography>
                            <Typography variant="body1">
                                Once your game is ready, click the button below to submit it for review. Our
                                team will test your game and approve it within 3-5 business days.
                            </Typography>
                        </Stack>

                        <Box mt={5} textAlign="right">
                            <Button
                                component={Link}
                                to="/add-game/new"
                                variant="contained"
                                size="large"
                            >
                                Add a Game
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}