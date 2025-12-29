import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Box, Typography, Button, Paper, List, ListItem, ListItemText} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {getCurrentPlayer} from '../../services/player.ts';
import {getPlayerGameStats} from '../../services/stats.ts';

export default function GameStatsPage() {
    const navigate = useNavigate();
    const {gameId} = useParams<{gameId: string}>();

    const {data: player} = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const {data: stats, isLoading} = useQuery({
        queryKey: ['gameStats', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerGameStats(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    const handleBackClick = () => {
        navigate(`/game/${gameId}`);
    };

    const winRate = stats && stats.gamesPlayed > 0
        ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
        : '0.0';

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Button onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
                    Back
                </Button>
                <Typography variant="h5">Statistics</Typography>
            </Box>

            <Paper elevation={3}>
                <Box p={4}>
                    <Typography variant="h6" mb={3}>My Statistics</Typography>

                    {isLoading ? (
                        <Typography textAlign="center">Loading statistics...</Typography>
                    ) : !stats || stats.gamesPlayed === 0 ? (
                        <Typography textAlign="center" color="text.secondary">
                            No games played yet. Start playing to see your statistics!
                        </Typography>
                    ) : (
                        <List>
                            <ListItem>
                                <ListItemText primary="Games Played" secondary={stats.gamesPlayed} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Wins" secondary={stats.wins} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Losses" secondary={stats.losses} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Win Rate" secondary={`${winRate}%`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Current Win Streak" secondary={stats.currentWinStreak} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Total Score" secondary={stats.totalScore} />
                            </ListItem>
                            {stats.totalKills > 0 && (
                                <ListItem>
                                    <ListItemText primary="Total Kills" secondary={stats.totalKills} />
                                </ListItem>
                            )}
                            {stats.perfectGames > 0 && (
                                <ListItem>
                                    <ListItemText primary="Perfect Games" secondary={stats.perfectGames} />
                                </ListItem>
                            )}
                        </List>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}