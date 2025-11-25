import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPythonGame, getPythonGameState, makePythonMove } from '../../services/pythonApi';
import GameEndOverlay from '../../components/overlays/GameEndOverlay';
import './TicTacToeGame.scss';

function TicTacToeGame() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw'>('win');

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
            setShowEndOverlay(false);
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

    // Check for game end
    useEffect(() => {
        if (pythonGame && pythonGame.status !== 'in_progress' && !showEndOverlay) {
            if (pythonGame.isDraw) {
                setGameResult('draw');
            } else if (pythonGame.winner === 'X') {
                setGameResult('win');
            } else {
                setGameResult('loss');
            }
            setShowEndOverlay(true);
        }
    }, [pythonGame, showEndOverlay]);

    const handleCellClick = (index: number) => {
        if (!selectedGameId || !pythonGame) return;
        if (pythonGame.boardCells[index] !== "") return;
        if (pythonGame.status !== "in_progress") return;

        makeMoveMutation.mutate({ gameId: selectedGameId, position: index + 1 });
    };

    const handleNewGame = () => {
        setSelectedGameId(null);
        setShowEndOverlay(false);
        createGameMutation.mutate();
    };

    const handleBackClick = () => {
        navigate('/game/tic-tac-toe');
    };

    return (
        <div className="tic-tac-toe-game">
            <div className="game-container-wrapper">
                <div className="game-header">
                    <div className="decorative-pattern" />
                </div>

                <div className="game-content">
                    <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                        ←
                    </button>

                    <h1 className="game-title">Tic-Tac-Toe</h1>

                    {!selectedGameId ? (
                        <div className="start-section">
                            <button
                                onClick={() => createGameMutation.mutate()}
                                className="btn-start"
                                disabled={createGameMutation.isPending}
                            >
                                {createGameMutation.isPending ? 'Starting...' : 'Start New Game'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {pythonGame && (
                                <>
                                    <div className="game-info">
                                        <div className="info-item">
                                            <span className="info-label">Current Turn:</span>
                                            <span className="info-value">{pythonGame.currentTurn}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Status:</span>
                                            <span className={`info-value status ${pythonGame.status}`}>
                                                {pythonGame.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="game-board">
                                        {pythonGame.boardCells.map((cell, index) => (
                                            <div
                                                key={index}
                                                className={`cell ${cell ? 'filled' : 'empty'} ${
                                                    cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''
                                                }`}
                                                onClick={() => handleCellClick(index)}
                                            >
                                                {cell || ''}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="game-footer">
                    <div className="decorative-pattern" />
                </div>
            </div>

            <GameEndOverlay
                isOpen={showEndOverlay}
                result={gameResult}
                gameId="tic-tac-toe"
                onPlayAgain={handleNewGame}
                onClose={() => {}}
            />
        </div>
    );
}

export default TicTacToeGame;
