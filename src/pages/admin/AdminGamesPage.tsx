import {useState} from 'react';
import {Box, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, Stack, Button, Paper} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {approveGame, getWaitingGames, rejectGame} from "../../services/game.ts";
import type {Game} from "../../model/types.ts";
import {useSearch} from "../../hooks/useSearch.ts";

export default function AdminGamesPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: games } = useQuery<Game[], Error>({
        queryKey: ['waitingGames'],
        queryFn: getWaitingGames,
    });

    const { searchQuery, searchResults, handleSearch } = useSearch<Game>({
        data: games || [],
        searchField: 'name',
    });

    const approveMutate = useMutation({
        mutationFn: approveGame,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waitingGames'] }),
    });

    const rejectMutate = useMutation({
        mutationFn: rejectGame,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['waitingGames'] }),
    });

    const handleApprove = (gameId: string) => approveMutate.mutate(gameId);
    const handleReject = (gameId: string) => rejectMutate.mutate(gameId);
    const handleMenuToggle = () => setIsMenuOpen(prev => !prev);

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box p={4}>
                <Box mb={5}>
                    <TextField
                        fullWidth
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        autoFocus
                        className="admin-search-field"
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
                </Box>

                <Typography variant="h4" gutterBottom className="admin-page-title">
                    Pending Games
                </Typography>

                <List className="admin-games-list">
                    {searchResults.map((game) => (
                        <Paper key={game.id} elevation={3} className="admin-game-item">
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText
                                        primary={game.name}
                                        primaryTypographyProps={{ variant: 'h6' }}
                                    />
                                </ListItemButton>

                                <Stack direction="row" spacing={2} pr={3}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleApprove(game.id)}
                                        size="medium"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleReject(game.id)}
                                        size="medium"
                                    >
                                        Reject
                                    </Button>
                                </Stack>
                            </ListItem>
                        </Paper>
                    ))}
                </List>

                {searchResults.length === 0 && (
                    <Box textAlign="center" mt={8}>
                        <Typography variant="h6" color="text.secondary">
                            No pending games found
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}