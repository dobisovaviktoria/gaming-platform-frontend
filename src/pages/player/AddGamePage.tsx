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
                <Typography variant="h4" mb={4}>Adding Games to the Platform</Typography>

                <Paper elevation={3}>
                    <Box p={4}>
                        <Stack spacing={3}>
                            <Typography variant="h6">Accessing the Submission Form</Typography>
                            <Typography variant="body1">
                                To add a game to the platform, navigate to the Add Your Game page from the main menu and click the ADD A GAME button to access the submission form.
                            </Typography>

                            <Typography variant="h6" mt={2}>Uploading Your Game</Typography>
                            <Typography variant="body1">
                                Follow these steps to submit your game:
                            </Typography>
                            <Typography variant="body1" component="div">
                                <ol style={{marginTop: '8px', paddingLeft: '24px'}}>
                                    <li>Navigate to the submission form</li>
                                    <li>Enter your game's name</li>
                                    <li>Provide the URL to your game's website endpoint</li>
                                    <li>Provide the URL for your game's display image (must be hosted online)</li>
                                    <li>Write a description of your game</li>
                                    <li>Provide detailed game rules explaining how to play</li>
                                    <li>Specify the maximum number of players supported</li>
                                    <li>Click ADD GAME to submit your game</li>
                                    <li>Wait for approval from the platform administrators</li>
                                </ol>
                            </Typography>

                            <Typography variant="h6" mt={2}>Technical Requirements</Typography>
                            <Typography variant="body1">
                                Your game must meet the following technical requirements to be compatible with the BanditGames platform:
                            </Typography>
                            <Typography variant="body1" component="div">
                                <Box component="ul" sx={{ mt: 1, pl: 3 }}>
                                    <li><strong>Public Hosting:</strong> Your game must be hosted on a publicly accessible website with no login required to access the game page</li>
                                    <li><strong>Mode Parameter Support:</strong> Your game must accept a <code>mode</code> request parameter with two possible values:
                                        <Box component="ul" sx={{ mt: 0.5, pl: 4 }}>
                                            <li><code>ai</code>: Launches single-player mode where the player competes against AI</li>
                                            <li><code>friend</code>: Launches multiplayer mode for two or more players using the provided <code>sessionId</code> parameter to maintain shared game state</li>
                                        </Box>
                                    </li>
                                    <li><strong>Platform Integration:</strong> When the game concludes, you may display your own end screen, but must provide a way for players to return to the BanditGames dashboard at <code>http://localhost:5173</code></li>
                                </Box>
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
