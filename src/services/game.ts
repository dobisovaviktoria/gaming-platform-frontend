import api from './api.ts';
import type {Game, NewGame} from '../model/types.ts';

export const getGames = async (): Promise<Game[]> => {
    const response = await api.get<Game[]>('/api/games');
    return response.data;
};

export const getGame = async (id: string): Promise<Game> => {
    const response = await api.get<Game>('/api/games/'+id);
    return response.data;
};

export const getWaitingGames = async (): Promise<Game[]> => {
    const response = await api.get<Game[]>('/api/games/waiting');
    return response.data;
};

export const addGame = async (game: NewGame): Promise<Game> => {
    const response = await api.post<Game>('/api/games', game);
    return response.data;
}

export const approveGame = async (gameId: string): Promise<void> => {
    await api.post(`/api/games/${gameId}/approve`);
};

export const rejectGame = async (gameId: string): Promise<void> => {
    await api.post(`/api/games/${gameId}/reject`);
};
