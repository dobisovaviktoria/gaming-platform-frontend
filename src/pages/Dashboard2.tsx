import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import GameCard from '../components/GameCard2';
import { getCurrentPlayer } from '../services/player';
import { getGames } from '../services/game';
import type { Game, Player } from '../model/types';
import './Dashboard2.scss';

const PREMADE_GAMES : Game[] = [
    {
        gameId : "Tic-Tac-Toe",
        maxPlayers : 2,
        description : "Simple Tic Tac Toe",
        isAvailable : true
    },
    {
        gameId : "Chess",
        maxPlayers : 2,
        description : "A normal chess game",
        isAvailable : true
    }
];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const { data: player, isLoading: isLoadingPlayer } = useQuery<Player, Error>({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: apiGames, isLoading: isLoadingGames } = useQuery<Game[], Error>({
        queryKey: ['games'],
        queryFn: getGames
    });

    const games = [...PREMADE_GAMES];
    if (apiGames) games.push(...apiGames);

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
                                <GameCard key={game.gameId} game={game} isFavorite={true} />
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
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
