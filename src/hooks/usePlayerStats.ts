import { useQuery } from '@tanstack/react-query';
import { getCurrentPlayer } from '../services/player';
import { getPlayerGameStats } from '../services/stats';


export const usePlayerStats = (gameId: string) => {
    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const statsQuery = useQuery({
        queryKey: ['gameStats', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerGameStats(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    return {
        player,
        stats: statsQuery.data,
        isLoading: statsQuery.isLoading,
        error: statsQuery.error
    };
};