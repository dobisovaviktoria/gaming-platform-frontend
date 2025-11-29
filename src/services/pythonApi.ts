import api from './apiPython';
import { getCurrentPlayer } from './player';

export interface PythonGame {
    gameId: string;
    boardCells: (string | null)[];
    currentTurn: 'X' | 'O' | null;
    winner?: 'X' | 'O' | null;
    isDraw: boolean;
    status: string;
}

export const createPythonGame = async (opponentId: string): Promise<{ gameId: string }> => {
    const player = await getCurrentPlayer();

    // Player is always X, opponent is O
    const response = await api.post('/api/python-games', null, {
        params: {
            playerXId: player.playerId,
            playerOId: opponentId
        }
    });
    return response.data;
};

export const getPythonGameState = async (gameId: string): Promise<PythonGame> => {
    const response = await api.get(`/api/python-games/${gameId}`);
    return response.data;
};

export const makePythonMove = async (gameId: string, position: number): Promise<PythonGame> => {
    const response = await api.post(`/api/python-games/${gameId}/move`, null, {
        params: { position }
    });
    return response.data;
};