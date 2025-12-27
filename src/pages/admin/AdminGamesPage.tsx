import { useState } from 'react';
import './AdminGamesPage.scss';
import {useSearch} from "../../hooks/useSearch.ts";
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {approveGame, getWaitingGames, rejectGame} from "../../services/game.ts";
import type {Game} from "../../model/types.ts";

export default function AdminGamesPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data: games, isLoading: isLoadingGames } = useQuery<Game[], Error>({
        queryKey: ['waitingGames'],
        queryFn: getWaitingGames
    });

    const approveMutate = useMutation({
        mutationFn: approveGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitingGames'] });
        }
    });

    const rejectMutate = useMutation({
        mutationFn: rejectGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waitingGames'] });
        }
    });

    const handleApprove = (gameId: string) => {
        approveMutate.mutate(gameId)
    };

    const handleReject = (gameId: string) => {
        rejectMutate.mutate(gameId)
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

    const { searchQuery, searchResults, isLoading: isLoadingSearch, error, handleSearch } = useSearch<Game>({
        data: games || [],
        searchField: 'name',
    });

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    const isLoading = isLoadingGames || isLoadingSearch;

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

            <main className="games-content">
                <h2 className="section-title">Games</h2>

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

                <div className="games-list">
                    {searchResults.map((game) => (
                        <div key={game.id} className="game-item">
                            <div className="game-info">
                <span className="game-players">
                  {game.name}
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
