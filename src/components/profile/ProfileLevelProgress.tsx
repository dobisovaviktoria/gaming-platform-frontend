import {Box, Typography, Stack, LinearProgress} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {getCurrentPlayer} from '../../services/player.ts';
import {getAllPlayerAchievements} from '../../services/achievements.ts';
import {getPlayerAllStats} from '../../services/stats.ts';
import {getFriends} from '../../services/player.ts';
import {LEVELS} from '../../model/types.ts';

function calculateLevel(gamesPlayed: number, achievementsCount: number, friendCount: number) {
    let level = 1;
    for (const lvl of LEVELS) {
        const { games, achievements, friends } = lvl.requirements;
        if (gamesPlayed >= games && achievementsCount >= achievements && friendCount >= friends) {
            level = lvl.level;
        } else {
            break;
        }
    }
    return level;
}

export default function ProfileLevelProgress() {
    const {data: player} = useQuery({queryKey: ['currentPlayer'], queryFn: getCurrentPlayer});
    const {data: achievements = []} = useQuery({
        queryKey: ['allAchievements', player?.playerId],
        queryFn: () => player?.playerId ? getAllPlayerAchievements(player.playerId) : [],
        enabled: !!player?.playerId,
    });
    const {data: allStats = []} = useQuery({
        queryKey: ['playerAllStats', player?.playerId],
        queryFn: () => player?.playerId ? getPlayerAllStats(player.playerId) : [],
        enabled: !!player?.playerId,
    });
    const {data: friends = []} = useQuery({
        queryKey: ['friends', player?.playerId],
        queryFn: () => player?.playerId ? getFriends() : [],
        enabled: !!player?.playerId,
    });

    if (!player) {
        return (
            <Box className="profile-level-progress">
                <Stack spacing={2} p={3}>
                    <Typography variant="body1">Loading level...</Typography>
                    <LinearProgress />
                </Stack>
            </Box>
        );
    }

    const gamesPlayed = allStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
    const friendCount = friends.length;
    const level = calculateLevel(gamesPlayed, achievements.length, friendCount);
    const levelInfo = LEVELS[level - 1];

    // Progress towards next level (0-100%)
    const nextLevel = LEVELS[level] || LEVELS[LEVELS.length - 1];
    const progressGames = Math.min(gamesPlayed / nextLevel.requirements.games, 1);
    const progressAchievements = Math.min(achievements.length / nextLevel.requirements.achievements || 1, 1);
    const progressFriends = Math.min(friendCount / nextLevel.requirements.friends || 1, 1);

    const progress = Math.round(
        ((progressGames + progressAchievements + progressFriends) / 3) * 100
    );

    return (
        <Box className="profile-level-progress">
            <Stack spacing={2} p={3}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" className="profile-progress-title">
                        Level: {levelInfo.name}
                    </Typography>
                    <Typography className="profile-progress-percent">
                        {progress}%
                    </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} className="profile-progress-bar" />
            </Stack>
        </Box>
    );
}
