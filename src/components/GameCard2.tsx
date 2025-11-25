import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Game } from '../model/types';
import './GameCard2.scss';

interface GameCardProps {
    game: Game;
    isFavorite?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isFavorite = false }) => {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate(`/game/${game.gameId}`);
    };

    return (
        <div className="game-card">
            {isFavorite && <span className="favorite-star">⭐</span>}
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
