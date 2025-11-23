import type {Game} from '../model/types';

interface Props {
    game: Game;
}

export default function GameCard({ game }: Props) {
    return (
        <div className="game-card">
            <h3>{game.description}</h3>
            <p>Max Players: {game.maxPlayers}</p>
            <span className={`status ${game.isAvailable ? 'available' : 'unavailable'}`}>
        {game.isAvailable ? 'Available' : 'Unavailable'}
      </span>
        </div>
    );
}