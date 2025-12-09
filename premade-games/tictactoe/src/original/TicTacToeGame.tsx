import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPythonGame } from '../pythonApi.ts'; // Game creation for AI remains an HTTP call
import { socket } from '../../../../src/services/socket.ts';
import { type PythonGameState } from '../../../../src/model/types.ts';
import GameEndOverlay from '../../../../src/components/overlays/GameEndOverlay';
import './TicTacToeGame.scss';
import { getCurrentPlayer } from '../../../../src/services/player.ts';

const AI_PLAYER_ID = "00000000-0000-0000-0000-000000000001";
type GameMode = 'ai' | 'friend';

function TicTacToeGame() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Component State
    const [gameId, setGameId] = useState<string | null>(null);
    const [game, setGame] = useState<PythonGameState | null>(null);
    const [player, setPlayer] = useState<{ playerId: string } | null>(null);
    const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null);
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw'>('win');
    const [isCreatingGame, setIsCreatingGame] = useState(false);

    const gameMode = (searchParams.get('mode') as GameMode);

    //  current player info on load
    useEffect(() => {
        getCurrentPlayer().then(setPlayer).catch(() => alert('Failed to load player data.'));
    }, []);

    // Game creation 
    useEffect(() => {
        if (!gameMode || !player || gameId) return;

        const handleAiGame = async () => {
            setIsCreatingGame(true);
            try {
                const newGame = await createPythonGame(player.playerId, AI_PLAYER_ID, 'ai');
                setGameId(newGame.gameId);
            } catch (error) {
                console.error('Failed to create AI game:', error);
                alert('Failed to create AI game. Is the Python server running?');
            } finally {
                setIsCreatingGame(false);
            }
        };

        const handleFriendGame = () => {
            const sessionId = searchParams.get('sessionId');
            if (sessionId) {
                setGameId(sessionId);
            } else {
                alert('Session ID missing for friend game.');
            }
        };

        if (gameMode === 'ai') {
            handleAiGame();
        } else if (gameMode === 'friend') {
            handleFriendGame();
        }
    }, [gameMode, player, gameId, searchParams]);


    // WebSocket connection 
    useEffect(() => {
        if (!gameId || !player) return;

        socket.connect();

        function onConnect() {
            console.log('Connected to WebSocket!');
            console.log('Attempting to join game with game_id:', gameId, 'and player_id:', player?.playerId);
            socket.emit('join_game', { game_id: gameId, player_id: player?.playerId });
        }

        function onGameStateUpdate(newGameState: PythonGameState) {
            console.log('Game state update received:', newGameState);
            setGame(newGameState);

            //  player symbol
            if (newGameState.player_x_id === player?.playerId) {
                setPlayerSymbol('X');
            } else if (newGameState.player_o_id === player?.playerId) {
                setPlayerSymbol('O');
            }
        }

        socket.on('connect', onConnect);
        socket.on('game_state_update', onGameStateUpdate);

        // Cleanup on component unmount or if gameId changes
        return () => {
            console.log('Disconnecting WebSocket.');
            socket.off('connect', onConnect);
            socket.off('game_state_update', onGameStateUpdate);
            socket.disconnect();
        };
    }, [gameId, player]);


    //  win/loss/draw when game state changes
    useEffect(() => {
        if (!game || game.status === 'in_progress' || game.status === 'waiting_for_opponent' || showEndOverlay) return;

        if (game.isDraw) setGameResult('draw');
        else if (game.winner === playerSymbol) setGameResult('win');
        else setGameResult('loss');

        setShowEndOverlay(true);
    }, [game, playerSymbol, showEndOverlay]);


    const handleCellClick = (index: number) => {
        if (!gameId || !game || !player) return;

        let currentSymbol: 'X' | 'O' | null = null;
        if (game.player_x_id === player.playerId) {
            currentSymbol = 'X';
        } else if (game.player_o_id === player.playerId) {
            currentSymbol = 'O';
        }

        if (game.boardCells[index] !== "" || game.status !== "in_progress") return;
        if (game.currentTurn !== currentSymbol) {
            console.warn("Not your turn!");
            return;
        }

        socket.emit('make_move', { game_id: gameId, position: index + 1 });
    };

    const handleNewGame = async () => {
        setShowEndOverlay(false);
        setGame(null);
        setGameId(null);
    };

    const handleBackClick = () => navigate('/game/tic-tac-toe');

    const getPlayerStatus = () => {
        if (!game) return 'N/A';
        if (game.status === 'waiting_for_opponent') return 'Waiting...';
        if (game.status === 'in_progress') return 'In Progress';
        if (game.isDraw) return 'Draw';
        return game.winner === playerSymbol ? 'Win' : 'Loss';
    };


    if (!player) return <p>Loading player data...</p>;
    if (!gameMode) return ( <div> <p>No game mode selected.</p> <button onClick={handleBackClick}>Go Back</button> </div> );

    return (
        <div className="tic-tac-toe-game">
            <div className="game-container-wrapper">
                <div className="game-header"><div className="decorative-pattern" /></div>

                <div className="game-content">
                    <button className="btn-back" onClick={handleBackClick} aria-label="Go back">←</button>
                    <h1 className="game-title">Tic-Tac-Toe</h1>

                    {isCreatingGame && <div className="start-section"><p>Starting AI Game...</p></div>}
                    
                    {!game && gameMode === 'friend' && <div className="start-section"><p>Joining game...</p></div>}

                    {game && game.status === 'waiting_for_opponent' && (
                        <div className="start-section">
                            <p>Waiting for opponent to join...</p>
                            <p className="game-id-info">Game ID: {game.gameId}</p>
                        </div>
                    )}

                    {game && (game.status === 'in_progress' || game.status === 'win' || game.status === 'draw') && (
                        <>
                            <div className="game-info">
                                <div className="info-item">
                                    <span className="info-label">Current Turn:</span>
                                    <span className="info-value">{game.currentTurn}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Your Symbol:</span>
                                    <span className="info-value">{playerSymbol}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Status:</span>
                                    <span className={`info-value status ${game.status}`}>
                                        {getPlayerStatus()}
                                    </span>
                                </div>
                            </div>

                            <div className="game-board">
                                {game.boardCells.map((cell, index) => (
                                    <div
                                        key={index}
                                        className={`cell ${cell ? 'filled' : 'empty'} ${
                                            cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''
                                        } ${game.currentTurn !== playerSymbol || game.status !== 'in_progress' ? 'disabled' : ''}`}
                                        onClick={() => handleCellClick(index)}
                                    >
                                        {cell || ''}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <GameEndOverlay
                        isOpen={showEndOverlay}
                        result={gameResult}
                        gameId={gameId}
                        onPlayAgain={handleNewGame}
                        onClose={() => setShowEndOverlay(false)}
                    />
                </div>

                <div className="game-footer"><div className="decorative-pattern" /></div>
            </div>
        </div>
    );
}

export default TicTacToeGame;

