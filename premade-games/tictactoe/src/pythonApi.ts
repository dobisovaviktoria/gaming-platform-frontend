import api from './apiPython';

export const createPythonGame = async (
    playerXId: string,
    playerOId: string,
    mode: 'ai' | 'friend'
): Promise<{ gameId: string }> => {
    const response = await api.post(`/api/python-games`, null, {
        params: {
            playerXId,   
            playerOId,   
            mode        
        }
    });
    return response.data;
};