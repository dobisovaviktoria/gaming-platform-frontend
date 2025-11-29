import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameModeOverlay.scss';

interface GameModeOverlayProps {
    isOpen: boolean;
    gameId: string;
    showLobby: () => void;
    onClose: () => void;
}

const GameModeOverlay: React.FC<GameModeOverlayProps> = ({ isOpen, showLobby, gameId, onClose }) => {
    const navigate = useNavigate();

    const handleAgainstAI = () => {
        console.log('Starting game against AI...');
        navigate(`/game/${gameId}/play?mode=ai`);
        onClose();
    };

    const handleHumanGame = () => {
        console.log('Starting human game...');
        showLobby();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="game-mode-overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="mode-container">
                <div className="mode-header">
                    <div className="header-content">
                        <h3 className="mode-title">Choose Game Mode</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="mode-content">
                    <div className="game-mode-buttons">
                        <button className="btn-mode" onClick={handleAgainstAI}>
                            <span className="mode-icon">🤖</span>
                            <span className="mode-label">Against AI</span>
                            <span className="mode-description">Play against computer</span>
                        </button>

                        <button className="btn-mode" onClick={handleHumanGame}>
                            <span className="mode-icon">👤</span>
                            <span className="mode-label">Against Human</span>
                            <span className="mode-description">Play with a friend</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameModeOverlay;