import api from './api';

export interface LobbyJoinRequest {
    gameId: string;
}

export interface LobbyResponse {
    status: 'WAITING' | 'MATCHED';
    sessionId: string | null;
    message: string;
}

export const joinLobby = async (request: LobbyJoinRequest): Promise<LobbyResponse> => {
    const response = await api.post<LobbyResponse>('/api/lobbies/join', request);
    return response.data;
};

export const checkLobbyStatus = async (gameId: string): Promise<LobbyResponse> => {
    const response = await api.get<LobbyResponse>(`/api/lobbies/status/${gameId}`);
    return response.data;
};
