import { useQuery } from '@tanstack/react-query';
import { getCurrentPlayer } from '../services/player';
import { getPlayerAchievementsForGame } from '../services/achievements';

export const usePlayerAchievements = (gameId: string) => {
    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const achievementsQuery = useQuery({
        queryKey: ['gameAchievements', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerAchievementsForGame(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    return {
        player,
        achievements: achievementsQuery.data,
        isLoading: achievementsQuery.isLoading,
        error: achievementsQuery.error
    };
};