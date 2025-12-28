import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Box, Typography, Paper, Grid, Stack, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import GameCard from '../../components/GameCard.tsx';
import ConfirmationDialog from '../../components/overlays/ConfirmationDialog.tsx';
import {getCurrentPlayer, addFavoriteGame, removeFavoriteGame} from '../../services/player.ts';
import {getGames} from '../../services/game.ts';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [gameToUnfavorite, setGameToUnfavorite] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: player, isLoading: isLoadingPlayer } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer,
    });

    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    const addFavoriteMutation = useMutation({
        mutationFn: addFavoriteGame,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['player'] }),
    });

    const removeFavoriteMutation = useMutation({
        mutationFn: removeFavoriteGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['player'] });
            setShowConfirm(false);
            setGameToUnfavorite(null);
        },
    });

    const handleToggleFavorite = (gameId: string, isFavorite: boolean) => {
        if (isFavorite) {
            setGameToUnfavorite(gameId);
            setShowConfirm(true);
        } else {
            addFavoriteMutation.mutate(gameId);
        }
    };

    const confirmUnfavorite = () => {
        if (gameToUnfavorite) removeFavoriteMutation.mutate(gameToUnfavorite);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearchClick = () => {
        navigate('/search');
    };

    const favoriteGames = games?.filter(g => player?.favoriteGameIds.includes(g.id)) || [];
    const allGames = games || [];
    const isLoading = isLoadingPlayer || isLoadingGames;

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box p={3}>
                <Paper elevation={2}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        onClick={handleSearchClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <SearchIcon />
                        <Typography variant="body1">Search</Typography>
                    </Box>
                </Paper>

                <Stack spacing={6} mt={4}>
                    <Box>
                        <Typography variant="h5" gutterBottom>Favourite</Typography>
                        {isLoading ? (
                            <Box textAlign="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : favoriteGames.length > 0 ? (
                            <Grid container spacing={3}>
                                {favoriteGames.map((game) => (
                                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={game.id}>
                                        <GameCard
                                            game={game}
                                            isFavorite={true}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">
                                You haven't marked any games as favorites yet.
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="h5" gutterBottom>All Games</Typography>
                        {isLoading ? (
                            <Box textAlign="center" my={4}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {allGames.map((game) => (
                                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={game.id}>
                                        <GameCard
                                            game={game}
                                            isFavorite={player?.favoriteGameIds.includes(game.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Stack>
            </Box>

            <ConfirmationDialog
                open={showConfirm}
                message="Are you sure you want to remove this game from your favorites?"
                onConfirm={confirmUnfavorite}
                onCancel={() => setShowConfirm(false)}
            />
        </Box>
    );
}