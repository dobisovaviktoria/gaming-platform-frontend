import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { useState } from 'react';
import {createPythonGame, getPythonGameState, makePythonMove} from '../services/pythonApi.ts';

function PythonGamesSection() {
    const queryClient = useQueryClient();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    const { data: pythonGame, refetch } = useQuery({
        queryKey: ['pythonGame', selectedGameId],
        queryFn: () => selectedGameId ? getPythonGameState(selectedGameId) : Promise.reject('No game selected'),
        enabled: !!selectedGameId,
        refetchInterval: false
    });

    const createGameMutation = useMutation({
        mutationFn: () => createPythonGame("Player X", "Player O"),
        onSuccess: (data) => {
            setSelectedGameId(data.gameId);
            queryClient.invalidateQueries({ queryKey: ['pythonGame', data.gameId] });
        },
        onError: (error) => {
            console.error('Failed to create game:', error);
            alert('Failed to create game. Is the Python server running?');
        }
    });

    const makeMoveMutation = useMutation({
        mutationFn: ({ gameId, position }: { gameId: string; position: number }) =>
            makePythonMove(gameId, position),
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            console.error('Failed to make move:', error);
            alert('Invalid move or game error');
        }
    });

    const handleCellClick = (index: number) => {
        if (!selectedGameId || !pythonGame) return;
        if (pythonGame.boardCells[index] !== "") return;
        if (pythonGame.status !== "in_progress") return;

        // Convert 0-indexed array position to 1-indexed board position
        makeMoveMutation.mutate({gameId: selectedGameId, position: index + 1});
    };

    const handleNewGame = () => {
        setSelectedGameId(null);
        createGameMutation.mutate();
    };

    return (
        <div className="python-games-dashboard">
            <h2>Python Tic-Tac-Toe</h2>

            {!selectedGameId ? (
                <button
                    onClick={() => createGameMutation.mutate()}
                    className="btn primary"
                    disabled={createGameMutation.isPending}
                >
                    {createGameMutation.isPending ? 'Starting...' : 'Start New Game'}
                </button>
            ) : (
                <button
                    onClick={handleNewGame}
                    className="btn secondary"
                >
                    New Game
                </button>
            )}

            {pythonGame && (
                <div className="game-container">
                    <div className="game-info">
                        <p><strong>Current Turn:</strong> {pythonGame.currentTurn}</p>
                        <p><strong>Status:</strong> {pythonGame.status}</p>
                        {pythonGame.winner && <p className="winner">🎉 Winner: {pythonGame.winner}!</p>}
                        {pythonGame.isDraw && <p className="draw">It's a Draw!</p>}
                    </div>

                    <div className="game-board" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 100px)',
                        gap: '5px',
                        marginTop: '20px'
                    }}>
                        {pythonGame.boardCells.map((cell, index) => (
                            <div
                                key={index}
                                className={`cell ${cell ? 'filled' : 'empty'}`}
                                onClick={() => handleCellClick(index)}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid #333',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    cursor: cell || pythonGame.status !== 'in_progress' ? 'not-allowed' : 'pointer',
                                    userSelect: 'none'
                                }}
                            >
                                {cell || ''}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PythonGamesSection;