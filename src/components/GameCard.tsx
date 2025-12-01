import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../model/types';
import './GameCard.scss';

interface GameCardProps {
    game: Game;
    isFavorite?: boolean;
    onToggleFavorite?: (gameId: string, isFavorite: boolean) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, isFavorite = false, onToggleFavorite }) => {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate(`/game/${game.gameId}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(game.gameId, isFavorite);
        }
    };

    return (
        <div className="game-card">
            <span 
                className="favorite-star" 
                onClick={handleFavoriteClick}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                {isFavorite ? '⭐' : '☆'}
            </span>
            <div className="game-image">
                {/* Placeholder image - replace with actual game image source */}
                <div className="image-placeholder">
                    <span className="game-icon">🎮</span>
                </div>
            </div>
            <h3 className="game-name">{game.gameId}</h3>
            <p className="game-players">{game.maxPlayers} players</p>
            <button
                className="btn-play"
                onClick={handlePlayClick}
                disabled={!game.isAvailable}
            >
                Play
            </button>
        </div>
    );
};

export default GameCard;
