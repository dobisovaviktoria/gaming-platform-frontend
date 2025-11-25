import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicTacToeGame from './premade-games/TicTacToeGame.tsx';
import './GamePlayPage.scss';
import GameLobbyOverlay from "../components/overlays/GameLobbyOverlay.tsx";

const GamePlayPage: React.FC = () => {
    const [ showLobby, setShowLobby ] = useState<boolean>(true);
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/game/${gameId}`);
    };

    // Route to specific game implementations
    const renderGame = () => {
        switch (gameId?.toLowerCase()) {
            case 'tic-tac-toe':
                return <TicTacToeGame />;

            // Add more games here as you implement them
            // case 'chess':
            //     return <ChessPage />;
            // case 'connect-4':
            //     return <Connect4Page />;

            default:
                // Empty page with back arrow for unimplemented games
                setShowLobby(false);
                return (
                    <div className="game-play-page">
                        <div className="empty-game-container">
                            <div className="game-header">
                                <div className="decorative-pattern" />
                            </div>

                            <div className="game-content">
                                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                                    ←
                                </button>

                                <div className="empty-state">
                                    <div className="empty-icon">🎮</div>
                                    <h2>Game Coming Soon</h2>
                                    <p>This game is not yet implemented.</p>
                                </div>
                            </div>

                            <div className="game-footer">
                                <div className="decorative-pattern" />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            {renderGame()}
            <GameLobbyOverlay
                isOpen={showLobby}
                gameId={gameId?gameId:""}
                gameName={gameId?gameId:""}
                maxPlayers={2}
                onClose={() => setShowLobby(false)}
                onStartGame={() => {
                    setShowLobby(false);
                }}
            />
        </>
    );
};

export default GamePlayPage;
