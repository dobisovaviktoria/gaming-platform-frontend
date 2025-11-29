import api from './api.ts';
import type {Game} from '../model/types.ts';

export const getGames = async (): Promise<Game[]> => {
    const response = await api.get<Game[]>('/api/games');
    return response.data;
};

export const getGame = async (id: string): Promise<Game> => {
    const response = await api.get<Game>('/api/games/'+id);
    return response.data;
};