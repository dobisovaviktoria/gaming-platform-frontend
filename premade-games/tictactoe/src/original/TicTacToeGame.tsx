import {useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {createPythonGame} from '../tictactoeApi.ts';
import {socket} from '../../../../src/services/socket.ts';
import {type PythonGameState} from '../../../../src/model/types.ts';
import GameEndOverlay from '../../../../src/components/overlays/GameEndOverlay';
import './TicTacToeGame.scss';
import {getCurrentPlayer} from '../../../../src/services/player.ts';

const AI_PLAYER_ID = "00000000-0000-0000-0000-000000000001";
type GameMode = 'ai' | 'friend';

function TicTacToeGame() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Component State
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [game, setGame] = useState<PythonGameState | null>(null);
    const [player, setPlayer] = useState<{ playerId: string } | null>(null);
    const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null);
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw'>('win');
    const [isCreatingGame, setIsCreatingGame] = useState(false);
    const [myWinProbability, setMyWinProbability] = useState<number | null>(null);

    const {gameId} = useParams<{gameId: string}>();
    const gameMode = (searchParams.get('mode') as GameMode);

    // Current player info on load
    useEffect(() => {
        getCurrentPlayer().then(setPlayer).catch(() => alert('Failed to load player data.'));
    }, []);

    // Game creation
    useEffect(() => {
        if (!gameMode || !player || sessionId) return;

        const handleAiGame = async () => {
            setIsCreatingGame(true);
            try {
                const newGame = await createPythonGame(player.playerId, AI_PLAYER_ID, 'ai');
                setSessionId(newGame.gameId);
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
                setSessionId(sessionId);
            } else {
                alert('Session ID missing for friend game.');
            }
        };

        if (gameMode === 'ai') {
            handleAiGame();
        } else if (gameMode === 'friend') {
            handleFriendGame();
        }
    }, [gameMode, player, sessionId, searchParams]);

    // WebSocket connection
    useEffect(() => {
        if (!sessionId || !player) return;

        socket.connect();

        function onConnect() {
            console.log('Connected to WebSocket!');
            console.log('Attempting to join game with game_id:', sessionId, 'and player_id:', player?.playerId);
            socket.emit('join_game', {game_id: sessionId, player_id: player?.playerId});
        }

        function onGameStateUpdate(newGameState: PythonGameState) {
            console.log('Game state update received:', newGameState);
            setGame(newGameState);

            // Determine player symbol
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
    }, [sessionId, player]);

    // Calculate my win probability when game state changes
    useEffect(() => {
        if (!game || !playerSymbol || game.status !== 'in_progress') {
            setMyWinProbability(null);
            return;
        }

        if (game.currentPlayerWinProbability === null || game.currentPlayerWinProbability === undefined) {
            setMyWinProbability(null);
            return;
        }

        // If it's my turn, this is my probability
        if (game.currentTurn === playerSymbol) {
            setMyWinProbability(game.currentPlayerWinProbability);
        } else {
            // If it's opponent's turn, my probability is inverse
            setMyWinProbability(1 - game.currentPlayerWinProbability);
        }
    }, [game, playerSymbol]);

    // Win/loss/draw when game state changes
    useEffect(() => {
        if (!game || game.status === 'in_progress' || game.status === 'waiting_for_opponent' || showEndOverlay) return;

        if (game.isDraw) setGameResult('draw');
        else if (game.winner === playerSymbol) setGameResult('win');
        else setGameResult('loss');

        setShowEndOverlay(true);
    }, [game, playerSymbol, showEndOverlay]);

    const handleCellClick = (index: number) => {
        if (!sessionId || !game || !player) return;

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

        socket.emit('make_move', { game_id: sessionId, position: index + 1 });
    };

    const handleNewGame = async () => {
        setShowEndOverlay(false);
        setGame(null);
        setSessionId(null);
        setMyWinProbability(null);
    };

    const handleBackClick = () => navigate(`/game/${gameId}`);

    const getPlayerStatus = () => {
        if (!game) return 'N/A';
        if (game.status === 'waiting_for_opponent') return 'Waiting...';
        if (game.status === 'in_progress') return 'In Progress';
        if (game.isDraw) return 'Draw';
        return game.winner === playerSymbol ? 'Win' : 'Loss';
    };

    const formatProbability = (prob: number | null): string => {
        if (prob === null) return 'N/A';
        return `${(prob * 100).toFixed(1)}%`;
    };



    if (!player) return <p>Loading player data...</p>;
    if (!gameMode) return (
        <div>
            <p>No game mode selected.</p>
            <button onClick={handleBackClick}>Go Back</button>
        </div>
    );

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

                                {/* Win Probability Display */}
                                {game.status === 'in_progress' && myWinProbability !== null && (
                                    <>


                                    </>
                                )}
                            </div>

                            {game.status === 'in_progress' && myWinProbability !== null && (
                                <div className="probability-bar-container">
                                    <span className="info-label">Win Probability:</span>
                                    <div className="probability-bar-labels">
                                        <span>0%</span>
                                        <span className="current-prob">{formatProbability(myWinProbability)}</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="probability-bar-track">
                                        <div
                                            className="probability-bar-fill"
                                            style={{ width: `${myWinProbability * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

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