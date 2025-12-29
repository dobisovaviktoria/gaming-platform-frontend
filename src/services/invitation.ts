import api from './api';

export interface InvitationResponse {
    invitationId: string;
    inviterId: string;
    inviteeId: string;
    gameId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface InvitationSessionResponse {
    sessionId: string;
    gameId: string;
    url: string;
    playerIds: string[];
}

export const sendInvitation = async (
    inviterId: string,
    inviteeId: string,
    gameId: string,
    url: string
): Promise<InvitationResponse> => {
    console.log(`Sending invitation: inviterId=${inviterId}, inviteeId=${inviteeId}, gameId=${gameId}, url=${url}`);
    const response = await api.post<InvitationResponse>(`/api/invitations/${inviterId}`, {
        inviteeId,
        gameId,
        url,
    });
    console.log('Invitation sent response:', response.data);
    return response.data;
};

export const getPendingInvitations = async (inviteeId: string): Promise<InvitationResponse[]> => {
    console.log(`Fetching pending invitations for inviteeId=${inviteeId}`);
    const response = await api.get<InvitationResponse[]>(`/api/invitations/pending/${inviteeId}`);
    console.log('Pending invitations fetched:', response.data);
    return response.data;
};

export const respondToInvitation = async (
    invitationId: string,
    responderId: string,
    accept: boolean
): Promise<InvitationSessionResponse | void> => {
    console.log(`Responding to invitation: invitationId=${invitationId}, responderId=${responderId}, accept=${accept}`);
    const response = await api.post<InvitationSessionResponse | void>(
        `/api/invitations/${invitationId}/respond/${responderId}`,
        { accept }
    );
    console.log('Invitation response result:', response.data);
    return response.data;
};

export interface InvitationStatusResponse {
    invitationId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    sessionId: string | null;
    url: string | null;
}

export const getInvitationStatus = async (invitationId: string): Promise<InvitationStatusResponse> => {
    console.log(`Checking status for invitationId=${invitationId}`);
    const response = await api.get<InvitationStatusResponse>(`/api/invitations/${invitationId}/status`);
    console.log('Invitation status fetched:', response.data);
    return response.data;
};
