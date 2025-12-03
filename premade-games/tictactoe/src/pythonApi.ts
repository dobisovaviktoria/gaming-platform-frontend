import api from './apiPython';

export interface PythonGame {
    gameId: string;
    boardCells: (string | null)[];
    currentTurn: 'X' | 'O' | null;
    winner?: 'X' | 'O' | null;
    isDraw: boolean;
    status: string;
}

export const createPythonGame = async (
    playerXId: string,
    playerOId: string,
    mode: 'ai' | 'friend'
): Promise<{ gameId: string }> => {
    const response = await api.post(`/api/python-games`, null, {
        params: {
            playerXId,   // Current player's UUID
            playerOId,   // AI UUID or Friend's UUID
            mode         // 'ai' or 'friend'
        }
    });
    return response.data;
};
export const getPythonGameState = async (gameId: string): Promise<PythonGame> => {
    const response = await api.get(`/api/python-games/${gameId}`);
    return response.data;
};

export const makePythonMove = async (gameId: string, position: number): Promise<PythonGame> => {
    const response = await api.post(`/api/python-games/${gameId}/move`, null, { params: { position } });
    return response.data;
};