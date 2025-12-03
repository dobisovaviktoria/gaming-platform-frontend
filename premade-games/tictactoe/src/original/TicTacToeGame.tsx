import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPythonGame, getPythonGameState, makePythonMove } from '../pythonApi.ts';
import GameEndOverlay from '../../../../src/components/overlays/GameEndOverlay';
import './TicTacToeGame.scss';
import { getCurrentPlayer } from '../../../../src/services/player.ts';

const AI_PLAYER_ID = "00000000-0000-0000-0000-000000000001";
type GameMode = 'ai' | 'friend';

function TicTacToeGame() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw'>('win');
    const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X'); // human player symbol

    const gameMode = (searchParams.get('mode') as GameMode) || null;

    const { data: currentPlayer, isLoading: isLoadingPlayer } = useQuery({
        queryKey: ['currentPlayer'],
        queryFn: getCurrentPlayer,
        staleTime: 5 * 60 * 1000,
    });

    const { data: pythonGame, refetch } = useQuery({
        queryKey: ['pythonGame', selectedGameId],
        queryFn: () => selectedGameId ? getPythonGameState(selectedGameId) : Promise.reject('No game selected'),
        enabled: !!selectedGameId,
    });

    const createGameMutation = useMutation({
        mutationFn: ({ mode, opponentId }: { mode: GameMode; opponentId: string }) => {
            if (!currentPlayer?.playerId) throw new Error('Player not loaded');
            return createPythonGame(currentPlayer.playerId, opponentId, mode);
        },
        onSuccess: (data) => {
            setSelectedGameId(data.gameId);
            setShowEndOverlay(false);
            setPlayerSymbol('X'); // human player is always X
            queryClient.invalidateQueries({ queryKey: ['pythonGame', data.gameId] });
        },
        onError: (error) => {
            console.error('Failed to create game:', error);
            alert('Failed to create game. Is the Python server running?');
        },
    });

    const makeMoveMutation = useMutation({
        mutationFn: ({ gameId, position }: { gameId: string; position: number }) =>
            makePythonMove(gameId, position),
        onSuccess: () => refetch(),
        onError: (error) => {
            console.error('Failed to make move:', error);
            alert('Invalid move or game error');
        },
    });

    // Auto-start AI game
    useEffect(() => {
        if (!gameMode || !currentPlayer || selectedGameId || createGameMutation.isPending) return;
        if (gameMode === 'friend') return; // Friend mode not implemented
        createGameMutation.mutate({ mode: 'ai', opponentId: AI_PLAYER_ID });
    }, [gameMode, currentPlayer, selectedGameId]);

    // Determine win/loss/draw
    useEffect(() => {
        if (!pythonGame || pythonGame.status === 'in_progress' || showEndOverlay) return;

        if (pythonGame.isDraw) setGameResult('draw');
        else if (pythonGame.winner === playerSymbol) setGameResult('win');
        else setGameResult('loss');

        setShowEndOverlay(true);
    }, [pythonGame, playerSymbol, showEndOverlay]);

    const handleCellClick = (index: number) => {
        if (!selectedGameId || !pythonGame) return;
        if (pythonGame.boardCells[index] !== "") return;
        if (pythonGame.status !== "in_progress") return;
        makeMoveMutation.mutate({ gameId: selectedGameId, position: index + 1 });
    };

    const handleNewGame = () => {
        setSelectedGameId(null);
        setShowEndOverlay(false);
        if (gameMode === 'ai') createGameMutation.mutate({ mode: 'ai', opponentId: AI_PLAYER_ID });
    };

    const handleBackClick = () => navigate('/game/tic-tac-toe');

    if (isLoadingPlayer) return <p>Loading player data...</p>;
    if (!currentPlayer) return <p>Unable to load player. Please log in again.</p>;
    if (!gameMode)
        return (
            <div>
                <p>No game mode selected. Please go back and select a mode.</p>
                <button onClick={handleBackClick}>Go Back</button>
            </div>
        );

    // Helper to show the player’s current game status correctly
    const getPlayerStatus = () => {
        if (!pythonGame) return 'N/A';
        if (pythonGame.status === 'in_progress') return 'In Progress';
        if (pythonGame.isDraw) return 'Draw';
        return pythonGame.winner === playerSymbol ? 'Win' : 'Loss';
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
                                onClick={() => createGameMutation.mutate({ mode: 'ai', opponentId: AI_PLAYER_ID })}
                                className="btn-start"
                                disabled={createGameMutation.isPending}
                            >
                                {createGameMutation.isPending ? 'Starting...' : 'Start New Game'}
                            </button>
                        </div>
                    ) : (
                        pythonGame && (
                            <>
                                <div className="game-info">
                                    <div className="info-item">
                                        <span className="info-label">Current Turn:</span>
                                        <span className="info-value">{pythonGame.currentTurn}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Your Game Status:</span>
                                        <span className={`info-value status ${pythonGame.status}`}>
                                            {getPlayerStatus()}
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
                        )
                    )}

                    <GameEndOverlay
                        isOpen={showEndOverlay}
                        result={gameResult}
                        gameId={selectedGameId} //
                        onPlayAgain={handleNewGame}
                        onClose={() => setShowEndOverlay(false)}
                    />
                </div>

                <div className="game-footer">
                    <div className="decorative-pattern" />
                </div>
            </div>
        </div>
    );
}

export default TicTacToeGame;
