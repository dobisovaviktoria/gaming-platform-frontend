import {Box} from '@mui/material';
import StatCard from './StatCard.tsx';
import {useQuery} from '@tanstack/react-query';
import {getCurrentPlayer, getFriends} from '../../services/player.ts';
import {getAllPlayerAchievements} from '../../services/achievements.ts';
import {getPlayerAllStats} from '../../services/stats.ts';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {LEVELS} from '../../model/types.ts';

function calculateLevel(gamesPlayed: number, achievementsCount: number, friendCount: number) {
    let level = 1;
    for (const lvl of LEVELS) {
        const {games, achievements, friends} = lvl.requirements;
        if (gamesPlayed >= games && achievementsCount >= achievements && friendCount >= friends) {
            level = lvl.level;
        } else {
            break;
        }
    }
    return level;
}

export default function ProfileStats() {
    const {data: player} = useQuery({queryKey: ['currentPlayer'], queryFn: getCurrentPlayer});
    const {data: friends = []} = useQuery({queryKey: ['friends'], queryFn: getFriends});
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

    if (!player) return null;

    const gamesPlayed = allStats.reduce((sum, stat) => sum + stat.gamesPlayed, 0);
    const friendCount = friends.length;
    const level = calculateLevel(gamesPlayed, achievements.length, friendCount);
    const levelInfo = LEVELS[level - 1];

    return (
        <Box width="100%" display="flex" flexWrap="wrap" gap={3}>
            <Box flex="1 1 21%">
                <StatCard icon={<EmojiEventsIcon />} label="Achievements" value={achievements.length} />
            </Box>
            <Box flex="1 1 21%">
                <StatCard icon={<PeopleAltIcon />} label="Friends" value={friendCount} />
            </Box>
            <Box flex="1 1 21%">
                <StatCard icon={<SportsEsportsIcon />} label="Games Played" value={gamesPlayed} />
            </Box>
            <Box flex="1 1 21%">
                <StatCard icon={<></>} label="Current Level" value={level} sublabel={levelInfo.name} />
            </Box>
        </Box>
    );
}
