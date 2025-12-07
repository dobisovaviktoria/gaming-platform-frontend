import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import './SearchPage.scss';

interface Game {
    id: string;
    name: string;
    players: number;
    category?: string;
    description?: string;
}

export default function SearchPage(){
    const navigate = useNavigate();

    const gamesData: Game[] = [
        { id: '1', name: 'Connect 4', players: 2, category: 'Strategy', description: 'Classic connect four game' },
        { id: '2', name: 'Tic Tac Toe', players: 2, category: 'Strategy', description: 'Simple X and O game' },
        { id: '3', name: 'Chess', players: 2, category: 'Strategy', description: 'Classic chess game' },
        { id: '4', name: 'Checkers', players: 2, category: 'Strategy', description: 'Board game with checkers' },
        { id: '5', name: 'Bang', players: 4, category: 'Card Game', description: 'Wild west card game' },
    ];

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<Game>({
        data: gamesData,
        searchField: 'name',
    });

    const handleBackClick = () => {
        navigate('/');
    };

    const handleGameClick = (gameId: string) => {
        console.log('Game selected:', gameId);
        // navigate(`/game/${gameId}`);
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="page">
            <header className="search-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>Search</h1>
            </header>

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Connect 4"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            <div className="search-results">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No results found</h2>
                        <p>Try again...</p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <ul className="results-list">
                        {searchResults.map((game) => (
                            <li key={game.id} onClick={() => handleGameClick(game.id)}>
                                <div className="game-info">
                                    <span className="game-name">{game.name}</span>
                                    {game.category && <span className="game-category">{game.category}</span>}
                                </div>
                                <span className="game-players">{game.players} players</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};