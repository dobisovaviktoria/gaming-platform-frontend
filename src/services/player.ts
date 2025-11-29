import api from './api.ts';
import type {Player} from '../model/types.ts';

export const getCurrentPlayer = async (): Promise<Player> => {
    const response = await api.get<Player>('/api/players/current');
    return response.data;
};

export interface PlayerBasicInfo {
    playerId: string;
    username: string;
}

export const getFriends = async (): Promise<PlayerBasicInfo[]> => {
    const response = await api.get<PlayerBasicInfo[]>('/api/players/friends');
    return response.data;
};

export interface PlayerSearchResponse {
    playerId: string;
    username: string;
    alreadyConnected: boolean;
}

export const getAllPlayers = async (): Promise<PlayerSearchResponse[]> => {
    const response = await api.get<PlayerSearchResponse[]>('/api/players');
    return response.data;
};

export interface FriendshipResponse {
    friendshipId: string;
    requesterId: string;
    recipientId: string;
    status: string;
}

export const addFriend = async (playerId: string): Promise<FriendshipResponse> => {
    const response = await api.post<FriendshipResponse>(`/api/players/${playerId}/friends`);
    return response.data;
};

export interface FriendRequest {
    friendshipId: string;
    requesterId: string;
    requesterName: string;
    sentAt: string;
}

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
    const response = await api.get<FriendRequest[]>('/api/players/requests');
    return response.data;
};

export const acceptFriendRequest = async (friendshipId: string): Promise<void> => {
    await api.post(`/api/players/friends/${friendshipId}/accept`);
};

export const rejectFriendRequest = async (friendshipId: string): Promise<void> => {
    await api.post(`/api/players/friends/${friendshipId}/reject`);
};