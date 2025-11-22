import axios from 'axios';
import keycloak from '../config/keycloak';
import { type Game, type Player } from '../types';

const API_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
});

// Add Authorization header to every request
api.interceptors.request.use((config) => {
    if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
});

export const getGames = async (): Promise<Game[]> => {
    const response = await api.get<Game[]>('/api/games');
    return response.data;
};

export const getCurrentPlayer = async (): Promise<Player> => {
    const response = await api.get<Player>('/api/players/current');
    return response.data;
};

export default api;
