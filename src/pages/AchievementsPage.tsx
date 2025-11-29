// pages/AchievementsPage.tsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import Achievement from '../components/Achievement';
import { useSearch } from '../hooks/useSearch';
import './AchievementsPage.scss';

interface AchievementData {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
}

interface Game {
    id: string;
    name: string;
    achievements: AchievementData[];
}

const AchievementsPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

    const gamesData: Game[] = [
        {
            id: '1',
            name: 'Tic Tac Toe',
            achievements: [
                {
                    id: '1',
                    name: 'First Win',
                    description: 'Win your first game of Tic Tac Toe',
                    icon: '🏆',
                    achieved: true
                },
                {
                    id: '2',
                    name: 'Win Streak',
                    description: 'Win 5 games in a row',
                    icon: '🔥',
                    achieved: true
                },
                {
                    id: '3',
                    name: 'Perfect Game',
                    description: 'Win without your opponent scoring',
                    icon: '⭐',
                    achieved: true
                },
                {
                    id: '4',
                    name: 'Master',
                    description: 'Win 50 games total',
                    icon: '👑',
                    achieved: false
                },
                {
                    id: '5',
                    name: 'Grand Master',
                    description: 'Win 100 games total',
                    icon: '💎',
                    achieved: false
                },
                {
                    id: '6',
                    name: 'Legend',
                    description: 'Win 250 games total',
                    icon: '🌟',
                    achieved: false
                },
                {
                    id: '7',
                    name: 'Unbeatable',
                    description: 'Win 50 games in a row',
                    icon: '🛡️',
                    achieved: false
                },
                {
                    id: '8',
                    name: 'Champion',
                    description: 'Reach rank #1 on the leaderboard',
                    icon: '🥇',
                    achieved: false
                },
            ],
        },
        {
            id: '2',
            name: 'Chess',
            achievements: [
                {
                    id: '9',
                    name: 'Checkmate',
                    description: 'Win your first chess game',
                    icon: '👑',
                    achieved: false
                },
                {
                    id: '10',
                    name: 'Castling Pro',
                    description: 'Successfully castle in 10 games',
                    icon: '🏰',
                    achieved: false
                },
            ],
        },
        {
            id: '3',
            name: 'Connect 4',
            achievements: [
                {
                    id: '11',
                    name: 'First Connect',
                    description: 'Win your first Connect 4 game',
                    icon: '🎯',
                    achieved: true
                },
                {
                    id: '12',
                    name: 'Vertical Master',
                    description: 'Win 10 games with vertical connections',
                    icon: '📏',
                    achieved: false
                },
            ],
        },
    ];

    const { searchQuery, searchResults, isLoading, handleSearch } = useSearch<Game>({
        data: gamesData,
        searchField: 'name',
    });

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

    const toggleGame = (gameId: string) => {
        setExpandedGames((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(gameId)) {
                newSet.delete(gameId);
            } else {
                newSet.add(gameId);
            }
            return newSet;
        });
    };

    const handleAchievementClick = (achievementId: string) => {
        console.log('Achievement clicked:', achievementId);
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0;

    return (
        <div className="achievements-page">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search games"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            <div className="achievements-content">
                <h1>Achievements</h1>

                {showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No games found</h2>
                        <p>Try a different search...</p>
                    </div>
                )}

                <div className="games-list">
                    {searchResults.map((game) => {
                        const isExpanded = expandedGames.has(game.id);
                        const achievedCount = game.achievements.filter((a) => a.achieved).length;
                        const toBeAchievedCount = game.achievements.filter((a) => !a.achieved).length;

                        return (
                            <div key={game.id} className="game-card">
                                <div className="game-header" onClick={() => toggleGame(game.id)}>
                                    <div className="game-title">
                                        <span className="game-name">{game.name}</span>
                                    </div>
                                    <button
                                        className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                    />
                                </div>

                                {isExpanded && (
                                    <div className="game-achievements">
                                        {achievedCount > 0 && (
                                            <div className="achievement-section">
                                                <h3>My badges</h3>
                                                <div className="achievements-grid">
                                                    {game.achievements
                                                        .filter((a) => a.achieved)
                                                        .map((achievement) => (
                                                            <Achievement
                                                                key={achievement.id}
                                                                icon={achievement.icon}
                                                                name={achievement.name}
                                                                description={achievement.description}
                                                                achieved={achievement.achieved}
                                                                onClick={() => handleAchievementClick(achievement.id)}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {toBeAchievedCount > 0 && (
                                            <div className="achievement-section">
                                                <h3>To Be Achieved</h3>
                                                <div className="achievements-grid">
                                                    {game.achievements
                                                        .filter((a) => !a.achieved)
                                                        .map((achievement) => (
                                                            <Achievement
                                                                key={achievement.id}
                                                                icon={achievement.icon}
                                                                name={achievement.name}
                                                                description={achievement.description}
                                                                achieved={achievement.achieved}
                                                                onClick={() => handleAchievementClick(achievement.id)}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsPage;
