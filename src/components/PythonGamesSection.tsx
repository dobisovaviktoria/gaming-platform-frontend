import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { useState } from 'react';
import {createPythonGame, getPythonGameState, makePythonMove} from '../services/pythonApi.ts';

function PythonGamesSection() {
    useQueryClient();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

    const { data: pythonGame, refetch } = useQuery({
        queryKey: ['pythonGame', selectedGameId],
        queryFn: () => selectedGameId ? getPythonGameState(selectedGameId) : Promise.reject('No game selected'),
        enabled: !!selectedGameId
    });

    const createGameMutation = useMutation({
        mutationFn: () => createPythonGame("ij45", "ko14"),
        onSuccess: (data) => setSelectedGameId(data.gameId)
    });

    const makeMoveMutation = useMutation({
        mutationFn: ({ gameId, position }: { gameId: string; position: number }) =>
            makePythonMove( gameId, position),
        onSuccess: () => refetch()
    });

    const handleCellClick = (index: number) => {
        if (!selectedGameId || !pythonGame || pythonGame.boardCells[index]) return;
        makeMoveMutation.mutate({gameId: selectedGameId, position: index});
    };

    return (
        <div className="python-games-dashboard">
            <h2>Python Tic-Tac-Toe</h2>
            <button
                onClick={() => createGameMutation.mutate()}
                className="btn primary"
            >
                Play
            </button>

            {pythonGame && (
                <div className="game-board">
                    {pythonGame.boardCells.map((cell, index) => (
                        <div
                            key={index}
                            className={`cell ${cell ? 'filled' : ''}`}
                            onClick={() => handleCellClick(index)}
                        >
                            {cell}
                        </div>
                    ))}
                    <p>Current Turn: {pythonGame.currentTurn}</p>
                    {pythonGame.winner && <p>Winner: {pythonGame.winner}</p>}
                    {pythonGame.isDraw && <p>It's a Draw!</p>}
                </div>
            )}
        </div>
    );
}

export default PythonGamesSection