import { useState } from 'react';
import './AdminGamesPage.scss';
import {useSearch} from "../../hooks/useSearch.ts";
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";

interface Game {
    id: string;
    title: string;
    user: string;
    status: 'pending';
}

export default function AdminGamesPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sample pending games - replace with actual data
    const games: Game[] = [
        { id: '1', title: 'TicTacToe', user: 'US', status: 'pending' },
        { id: '2', title: 'Chess', user: 'Teachers', status: 'pending' },
        { id: '3', title: 'Connect 4', user: 'Jip', status: 'pending' },
        { id: '4', title: 'Minesweeper', user: 'Janneke', status: 'pending' },
    ];

    const handleApprove = (gameId: string) => {
        console.log('Approving game:', gameId);
    };

    const handleReject = (gameId: string) => {
        console.log('Rejecting game:', gameId);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<Game>({
        data: games,
        searchField: 'title',
    });

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="page pending-games">
            <Navbar onMenuToggle={handleMenuToggle}/>
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Example"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

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

            <main className="games-content">
                <h2 className="section-title">Games</h2>

                <div className="games-list">
                    {searchResults.map((game) => (
                        <div key={game.id} className="game-item">
                            <div className="game-info">
                <span className="game-players">
                  {game.title} by {game.user}
                </span>
                            </div>

                            <div className="game-actions">
                                <button
                                    className="btn-approve"
                                    onClick={() => handleApprove(game.id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleReject(game.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
