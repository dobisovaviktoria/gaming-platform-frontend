import api from './api.ts';
import type {DataGenerationConfig, DataGenerationResponse, Game, NewGame} from '../model/types.ts';
import apiPython from "./apiPython.ts";

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

export const postGeneratedData = async (config: DataGenerationConfig): Promise<DataGenerationResponse> => {
    const response = await apiPython.post(`/api/python-games/generated?game=${config.game}&games=${config.plays}`);
    return response.data;
};

export const getGeneratedData = async (): Promise<DataGenerationResponse[]> => {
    const response = await apiPython.get<DataGenerationResponse[]>('/api/python-games/generated');
    return response.data;
};

export const deleteGeneratedData = async (file: string): Promise<void> => {
    await apiPython.delete(`/api/python-games/generated?file=${file}`);
};
