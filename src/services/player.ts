import api from './api.ts';
import type {Player} from '../model/types.ts';

export const getCurrentPlayer = async (): Promise<Player> => {
    const response = await api.get<Player>('/api/players/current');
    return response.data;
};