import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Box, Typography, Button, Stack, Grid, Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import StarIcon from '@mui/icons-material/Star';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Achievement from '../../components/Achievement.tsx';
import {getCurrentPlayer} from '../../services/player.ts';
import {getPlayerAchievementsForGame} from '../../services/achievements.ts';

export default function GameAchievementsPage() {
    const navigate = useNavigate();
    const {gameId} = useParams<{gameId: string}>();

    const {data: player} = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const {data: achievementsData, isLoading} = useQuery({
        queryKey: ['gameAchievements', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerAchievementsForGame(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    const handleBackClick = () => {
        navigate(`/game/${gameId}/`);
    };

    const achievements = achievementsData?.achievements || [];
    const achievedBadges = achievements.filter((a: any) => a.unlocked);
    const lockedBadges = achievements.filter((a: any) => !a.unlocked);

    const getAchievementIcon = (achievement: any) => {
        try {
            const criteria = JSON.parse(achievement.criteria);
            const iconMap: Record<string, React.ReactNode> = {
                'WINS_COUNT': <MilitaryTechIcon className="trophy-icon" />,
                'WIN_STREAK': <WhatshotIcon className="fire-icon" />,
                'GAMES_PLAYED': <SportsEsportsIcon />,
                'SCORE_THRESHOLD': <StarIcon className="star-icon" />,
                'KILLS_COUNT': <SportsMartialArtsIcon className="sword-icon" />,
                'PERFECT_GAME': <DiamondIcon className="diamond-icon" />,
            };
            return iconMap[criteria.type] || <EmojiEventsIcon />;
        } catch {
            return <EmojiEventsIcon />;
        }
    };

    return (
        <Box className="game-achievements-container">
            <Box className="achievements-header">
                <Button
                    onClick={handleBackClick}
                    startIcon={<ArrowBackIcon />}
                    className="achievements-back-button"
                >
                    Back
                </Button>
                <Typography variant="h4" className="achievements-title">
                    Achievements
                </Typography>
            </Box>

            {isLoading ? (
                <Typography textAlign="center" className="achievements-loading">
                    Loading achievements...
                </Typography>
            ) : achievements.length === 0 ? (
                <Typography textAlign="center" color="text.secondary">
                    No achievements available for this game yet.
                </Typography>
            ) : (
                <Stack spacing={6}>
                    {achievedBadges.length > 0 && (
                        <Paper elevation={4} className="achievements-section unlocked">
                            <Box className="achievements-section-content">
                                <Typography variant="h6" className="achievements-section-title">
                                    My badges ({achievedBadges.length}/{achievements.length})
                                </Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    {achievedBadges.map((achievement: any) => (
                                        <Grid key={achievement.id}>
                                            <Achievement
                                                icon={getAchievementIcon(achievement)}
                                                name={achievement.name}
                                                description={achievement.description}
                                                achieved={true}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    )}

                    {lockedBadges.length > 0 && (
                        <Paper elevation={4} className="achievements-section locked">
                            <Box className="achievements-section-content">
                                <Typography variant="h6" className="achievements-section-title">
                                    To Be Achieved
                                </Typography>
                                <Grid container spacing={3} justifyContent="center">
                                    {lockedBadges.map((achievement: any) => (
                                        <Grid key={achievement.id}>
                                            <Achievement
                                                icon={getAchievementIcon(achievement)}
                                                name={achievement.name}
                                                description={achievement.description}
                                                achieved={false}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Paper>
                    )}
                </Stack>
            )}
        </Box>
    );
}