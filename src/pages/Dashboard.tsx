import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import GameCard from '../components/GameCard.tsx';
import ConfirmationDialog from '../components/overlays/ConfirmationDialog.tsx';
import { getCurrentPlayer, addFavoriteGame, removeFavoriteGame } from '../services/player';
import { getGames } from '../services/game';
import type { Game, Player } from '../model/types';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [gameToUnfavorite, setGameToUnfavorite] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: player, isLoading: isLoadingPlayer } = useQuery<Player, Error>({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: games, isLoading: isLoadingGames } = useQuery<Game[], Error>({
        queryKey: ['games'],
        queryFn: getGames
    });

    const addFavoriteMutation = useMutation({
        mutationFn: addFavoriteGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['player'] });
        }
    });

    const removeFavoriteMutation = useMutation({
        mutationFn: removeFavoriteGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['player'] });
            setShowConfirm(false);
            setGameToUnfavorite(null);
        }
    });

    const handleToggleFavorite = (gameId: string, isFavorite: boolean) => {
        if (isFavorite) {
            setGameToUnfavorite(gameId);
            setShowConfirm(true);
        } else {
            addFavoriteMutation.mutate(gameId);
        }
    };

    const confirmUnfavorite = () => {
        if (gameToUnfavorite) {
            removeFavoriteMutation.mutate(gameToUnfavorite);
        }
    };

    const cancelUnfavorite = () => {
        setShowConfirm(false);
        setGameToUnfavorite(null);
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

    const handleSearchClick = () => {
        navigate('/search');
    };

    const favoriteGames = games?.filter((g) => player?.favoriteGameIds.includes(g.gameId)) || [];
    const availableGames = games?.filter(g => g.isAvailable) || [];

    return (
        <div className="dashboard">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="dashboard-content">
                <div className="search-bar-container" onClick={handleSearchClick}>
                    <span className="search-icon">🔍</span>
                    <span className="search-placeholder">Search</span>
                </div>

                <section className="favorites-section">
                    <h2>Favourite</h2>
                    {isLoadingPlayer || isLoadingGames ? (
                        <p className="loading-text">Loading...</p>
                    ) : favoriteGames.length > 0 ? (
                        <div className="game-grid">
                            {favoriteGames.map((game) => (
                                <GameCard 
                                    key={game.gameId} 
                                    game={game} 
                                    isFavorite={true} 
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>You haven't marked any games as favorites yet.</p>
                    )}
                </section>

                <section className="all-games-section">
                    <h2>All Games</h2>
                    {isLoadingGames ? (
                        <p className="loading-text">Loading...</p>
                    ) : (
                        <div className="game-grid">
                            {availableGames.map((game) => (
                                <GameCard
                                    key={game.gameId}
                                    game={game}
                                    isFavorite={player?.favoriteGameIds.includes(game.gameId)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
            {showConfirm && (
                <ConfirmationDialog
                    message="Are you sure you want to remove this game from your favorites?"
                    onConfirm={confirmUnfavorite}
                    onCancel={cancelUnfavorite}
                />
            )}
        </div>
    );
};

export default Dashboard;
