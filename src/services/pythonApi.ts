import api from './api';

export interface PythonGame {
    gameId: string;
    boardCells: (string | null)[];
    currentTurn: 'X' | 'O' | null;
    winner?: 'X' | 'O' | null;
    isDraw: boolean;
}

export const createPythonGame = async (playerX: string, playerO: string): Promise<{ gameId: string }> => {
    const response = await api.post('/python-games', null, { params: { playerX, playerO } });
    return response.data;
};

export const getPythonGameState = async (gameId: string): Promise<PythonGame> => {
    const response = await api.get(`/python-games/${gameId}`);
    return response.data;
};

export const makePythonMove = async (gameId: string, position: number): Promise<PythonGame> => {
    const response = await api.post(`/python-games/${gameId}/move`, null, { params: { position } });
    return response.data;
};