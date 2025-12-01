import api from './api';
import type { PlayerAchievementsResponse } from '../model/types';

export const getPlayerAchievementsForGame = async (
    playerId: string,
    gameId: string
): Promise<PlayerAchievementsResponse> => {
    const response = await api.get<PlayerAchievementsResponse>(
        `/api/players/${playerId}/games/${gameId}/achievements`
    );
    return response.data;
};

export const getAllPlayerAchievements = async (playerId: string): Promise<any[]> => {
    const response = await api.get(`/api/players/${playerId}/achievements`);
    return response.data;
};