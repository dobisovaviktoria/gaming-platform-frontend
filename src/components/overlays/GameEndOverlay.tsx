import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameEndOverlay.scss';

type GameResult = 'win' | 'loss' | 'draw';

interface GameEndOverlayProps {
    isOpen: boolean;
    result: GameResult;
    gameId: string;
    onPlayAgain: () => void;
    onClose?: () => void;
}

const GameEndOverlay: React.FC<GameEndOverlayProps> = ({
                                                           isOpen,
                                                           result,
                                                           gameId,
                                                           onPlayAgain,
                                                           onClose
                                                       }) => {
    const navigate = useNavigate();

    const getResultConfig = () => {
        switch (result) {
            case 'win':
                return {
                    title: 'Congrats! You Won!',
                    emoji: '🎉',
                    titleClass: 'title-win'
                };
            case 'loss':
                return {
                    title: 'Sorry! You Lost!',
                    emoji: '😔',
                    titleClass: 'title-loss'
                };
            case 'draw':
                return {
                    title: "It's A Draw!",
                    emoji: '🤝',
                    titleClass: 'title-draw'
                };
        }
    };

    const handleSeeStats = () => {
        navigate(`/game/${gameId}/statistics`);
        if (onClose) onClose();
    };

    const handlePlayAgain = () => {
        onPlayAgain();
        if (onClose) onClose();
    };

    const handleGoHome = () => {
        navigate('/');
        if (onClose) onClose();
    };

    if (!isOpen) return null;

    const config = getResultConfig();

    return (
        <div className="game-end-overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <div className="result-info">
                            <div className="result-emoji">{config.emoji}</div>
                            <h2 className={`result-title ${config.titleClass}`}>{config.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="overlay-content">
                    <div className="action-buttons">
                        <button className="btn-action btn-stats" onClick={handleSeeStats}>
                            <span className="btn-icon">📊</span>
                            <span className="btn-label">See My Stats</span>
                        </button>
                        <button className="btn-action btn-play-again" onClick={handlePlayAgain}>
                            <span className="btn-icon">🔄</span>
                            <span className="btn-label">Play Again</span>
                        </button>
                        <button className="btn-action btn-home" onClick={handleGoHome}>
                            <span className="btn-icon">🏠</span>
                            <span className="btn-label">Go Home</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameEndOverlay;
