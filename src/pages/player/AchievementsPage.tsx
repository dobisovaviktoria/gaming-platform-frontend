import {useState} from 'react';
import {Box, Typography, TextField, InputAdornment, Grid, Stack, Paper} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockIcon from '@mui/icons-material/Lock';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import Achievement from '../../components/Achievement.tsx';
import {useSearch} from '../../hooks/useSearch.ts';
import {useQuery} from '@tanstack/react-query';
import {getGames} from '../../services/game.ts';
import {getPlayerAchievementsForGame} from '../../services/achievements.ts';
import {getCurrentPlayer} from '../../services/player.ts';

export default function AchievementsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

    const {data: player} = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer,
    });

    const {data: games} = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    const {data: allAchievements} = useQuery({
        queryKey: ['allAchievements', player?.playerId],
        queryFn: async () => {
            if (!player || !games) return [];
            const promises = games.map((game) =>
                getPlayerAchievementsForGame(player.playerId, game.id)
                    .then((data) => ({
                        gameId: game.id,
                        gameName: game.name,
                        achievements: data.achievements,
                    }))
                    .catch(() => ({
                        gameId: game.id,
                        gameName: game.name,
                        achievements: [],
                    }))
            );
            return Promise.all(promises);
        },
        enabled: !!player && !!games,
    });

    const {searchQuery, searchResults, handleSearch} = useSearch({
        data: allAchievements || [],
        searchField: 'gameName',
    });

    const toggleGame = (gameId: string) => {
        setExpandedGames((prev) => {
            const newSet = new Set(prev);
            newSet.has(gameId) ? newSet.delete(gameId) : newSet.add(gameId);
            return newSet;
        });
    };

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box className="achievements-page-content">
                <Box className="achievements-search">
                    <TextField
                        fullWidth
                        placeholder="Search games"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
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

                <Typography variant="h4" className="achievements-main-title">
                    Achievements
                </Typography>

                <Stack spacing={4}>
                    {searchResults.map((game) => {
                        const isExpanded = expandedGames.has(game.gameId);
                        const achieved = game.achievements.filter((a: any) => a.unlocked).length;
                        const total = game.achievements.length;

                        if (total === 0) return null;

                        return (
                            <Paper key={game.gameId} elevation={3} className="achievements-game-card">
                                <Box
                                    className="achievements-game-header"
                                    onClick={() => toggleGame(game.gameId)}
                                >
                                    <Typography variant="h6">{game.gameName}</Typography>
                                    <Box className="achievements-game-status">
                                        <Typography variant="body2">
                                            {achieved}/{total} unlocked
                                        </Typography>
                                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </Box>
                                </Box>

                                {isExpanded && (
                                    <Box className="achievements-game-list">
                                        <Grid container spacing={3}>
                                            {game.achievements.map((achievement: any) => (
                                                <Grid key={achievement.id}>
                                                    <Achievement
                                                        icon={
                                                            achievement.unlocked ? (
                                                                <EmojiEventsIcon className="achievement-icon-unlocked" />
                                                            ) : (
                                                                <LockIcon className="achievement-icon-locked" />
                                                            )
                                                        }
                                                        name={achievement.name}
                                                        description={achievement.description}
                                                        achieved={achievement.unlocked}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        );
                    })}
                </Stack>

                {searchResults.length === 0 && (
                    <Box className="achievements-empty-state">
                        <SentimentDissatisfiedIcon className="achievements-empty-icon" />
                        <Typography variant="h5" className="achievements-empty-title">
                            No games found
                        </Typography>
                        <Typography className="achievements-empty-subtitle">
                            Try a different search...
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}