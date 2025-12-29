import {useEffect, useState} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Box, Typography, Button, Stack, Avatar, Grid} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import GameModeOverlay from "../../components/overlays/GameModeOverlay.tsx";
import GameLobbyOverlay from "../../components/overlays/GameLobbyOverlay.tsx";
import {getGame} from '../../services/game.ts';

export default function GameDetailsPage() {
    const [showModeOverlay, setShowModeOverlay] = useState(false);
    const [showLobbyOverlay, setShowLobbyOverlay] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const {gameId} = useParams<{gameId: string}>();
    const navigate = useNavigate();
    const location = useLocation();

    const {data: game} = useQuery({
        queryKey: ['game', gameId],
        queryFn: () => getGame(gameId!),
    });

    const handlePlayClick = () => {
        if (game?.name === 'Chess') {
            window.location.href = game.url;
        } else {
            setShowModeOverlay(true);
        }
    };

    // Add this useEffect to check for state
    useEffect(() => {
        if (location.state?.openLobby) {
            setShowLobbyOverlay(true);
            // Optional: Clear the state so it doesn't reopen on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    const handleStatsClick = () => navigate(`/game/${gameId}/statistics`);
    const handleAchievementsClick = () => navigate(`/game/${gameId}/achievements`);

    const handleMenuToggle = () => setIsMenuOpen(prev => !prev);

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box className="game-details-container">
                <Typography variant="h3" className="game-details-title">
                    {game?.name}
                </Typography>

                <Grid container spacing={4} className="game-details-grid">
                    <Grid size={{xs: 12, md: 7}} className="game-details-image-wrapper">
                        <Avatar
                            src={game?.pictureUrl}
                            alt={game?.name}
                            variant="rounded"
                            className="game-details-image"
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 5}} className="game-details-actions-wrapper">
                        <Stack spacing={3} className="game-details-actions">
                            <Button
                                variant="outlined"
                                startIcon={<EmojiEventsIcon />}
                                onClick={handleAchievementsClick}
                                className="game-details-button"
                            >
                                Achievements
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<BarChartIcon />}
                                onClick={handleStatsClick}
                                className="game-details-button"
                            >
                                Stats
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>

                <Box className="game-details-overview">
                    <Typography variant="h5" className="game-details-section-title">
                        Overview
                    </Typography>
                    <Typography variant="body1" className="game-details-description">
                        {game?.description}
                        <br />
                        Max players: {game?.maxPlayers}
                    </Typography>
                </Box>

                <Box className="game-details-play-button-container">
                    <Button
                        variant="contained"
                        size="large"
                        endIcon={<PlayArrowIcon />}
                        onClick={handlePlayClick}
                        className="game-details-play-button"
                    >
                        Play
                    </Button>
                </Box>
            </Box>

            <GameModeOverlay
                isOpen={showModeOverlay}
                url={game?.url || ''}
                showLobby={() => setShowLobbyOverlay(true)}
                onClose={() => setShowModeOverlay(false)}
            />

            <GameLobbyOverlay
                isOpen={showLobbyOverlay}
                gameName={game?.name || ''}
                gameId={game?.id || ''}
                url={game?.url || ''}
                maxPlayers={game?.maxPlayers || 2}
                onClose={() => setShowLobbyOverlay(false)}
            />
        </Box>
    );
}