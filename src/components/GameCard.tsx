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
        navigate(`/game/${game.id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(game.id, isFavorite);
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
                    <img className="game-image" src={game.pictureUrl} alt={game.name} />
                </div>
            </div>
            <h3 className="game-name">{game.name}</h3>
            <p className="game-players">{game.maxPlayers} players</p>
            <button
                className="btn-play"
                onClick={handlePlayClick}
            >
                Play
            </button>
        </div>
    );
};

export default GameCard;
