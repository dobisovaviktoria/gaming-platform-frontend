import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createPythonGame, getPythonGameState, makePythonMove, type PythonGame } from '../services/pythonApi';
import { getCurrentPlayer } from '../services/player';
import './TicTacToeGame.scss';

const TicTacToeGame: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const opponentId = searchParams.get('opponent');

    const [gameId, setGameId] = useState<string | null>(null);
    const [gameState, setGameState] = useState<PythonGame | null>(null);
    const [selectedCell, setSelectedCell] = useState<number | null>(null);

    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const createGameMutation = useMutation({
        mutationFn: (opponent: string) => createPythonGame(opponent),
        onSuccess: (data) => {
            setGameId(data.gameId);
        }
    });

    const makeMoveMutation = useMutation({
        mutationFn: ({ gameId, position }: { gameId: string; position: number }) =>
            makePythonMove(gameId, position),
        onSuccess: (data) => {
            setGameState(data);
        }
    });

    useEffect(() => {
        if (player && !gameId) {
            let opponent: string;

            if (mode === 'ai') {
                // AI opponent - use a special UUID
                opponent = '00000000-0000-0000-0000-000000000001';
            } else if (mode === 'human' && opponentId) {
                opponent = opponentId;
            } else {
                console.error('Invalid game mode or missing opponent');
                navigate('/');
                return;
            }

            createGameMutation.mutate(opponent);
        }
    }, [player, gameId, mode, opponentId]);

    useEffect(() => {
        if (!gameId) return;

        const fetchGameState = async () => {
            const state = await getPythonGameState(gameId);
            setGameState(state);
        };

        fetchGameState();

        const interval = setInterval(() => {
            if (gameState?.currentTurn === 'O' && mode === 'ai') {
                fetchGameState();
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [gameId, gameState?.currentTurn, mode]);

    const handleCellClick = (position: number) => {
        if (!gameId || !gameState) return;
        if (gameState.status !== 'in_progress') return;
        if (gameState.currentTurn !== 'X') return;
        if (gameState.boardCells[position - 1] !== '') return;

        setSelectedCell(position);
        makeMoveMutation.mutate({ gameId, position });
    };

    const handleBackToDashboard = () => {
        navigate('/');
    };

    const handlePlayAgain = () => {
        setGameId(null);
        setGameState(null);
        setSelectedCell(null);
    };

    if (!player) {
        return <div className="tic-tac-toe-game loading">Loading player...</div>;
    }

    if (createGameMutation.isPending) {
        return <div className="tic-tac-toe-game loading">Creating game...</div>;
    }

    if (!gameState) {
        return <div className="tic-tac-toe-game loading">Loading game...</div>;
    }

    const isGameOver = gameState.status !== 'in_progress';
    const isPlayerTurn = gameState.currentTurn === 'X';

    return (
        <div className="tic-tac-toe-game">
            <div className="game-header">
                <button className="btn-back" onClick={handleBackToDashboard}>
                    ← Back
                </button>
                <h1>Tic Tac Toe</h1>
                <div className="game-mode-indicator">
                    {mode === 'ai' ? '🤖 vs AI' : '👥 Human vs Human'}
                </div>
            </div>

            <div className="game-status">
                {isGameOver ? (
                    <>
                        {gameState.isDraw && <h2 className="status-draw">It's a Draw! 🤝</h2>}
                        {gameState.winner === 'X' && <h2 className="status-win">You Won! 🎉</h2>}
                        {gameState.winner === 'O' && <h2 className="status-lose">You Lost! 😔</h2>}
                    </>
                ) : (
                    <h2 className="status-playing">
                        {isPlayerTurn ? "Your turn (X)" : "Opponent's turn (O)"}
                    </h2>
                )}
            </div>

            <div className="game-board">
                {gameState.boardCells.map((cell, index) => {
                    const position = index + 1;
                    return (
                        <button
                            key={index}
                            className={`board-cell ${cell ? 'filled' : ''} ${
                                selectedCell === position ? 'selected' : ''
                            }`}
                            onClick={() => handleCellClick(position)}
                            disabled={!isPlayerTurn || isGameOver || cell !== ''}
                        >
                            {cell || ''}
                        </button>
                    );
                })}
            </div>

            {isGameOver && (
                <div className="game-actions">
                    <button className="btn-primary" onClick={handlePlayAgain}>
                        Play Again
                    </button>
                    <button className="btn-secondary" onClick={handleBackToDashboard}>
                        Back to Dashboard
                    </button>
                </div>
            )}

            {makeMoveMutation.isPending && (
                <div className="loading-overlay">
                    <div className="spinner">⏳</div>
                    <p>Making move...</p>
                </div>
            )}
        </div>
    );
};

export default TicTacToeGame;