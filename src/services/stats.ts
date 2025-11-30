import api from './api';
import type { PlayerGameStats } from '../model/types';

export const getPlayerGameStats = async (
    playerId: string,
    gameId: string
): Promise<PlayerGameStats> => {
    const response = await api.get<PlayerGameStats>(
        `/api/players/${playerId}/games/${gameId}/stats`
    );
    return response.data;
};