import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import Achievement from '../components/Achievement';
import { useSearch } from '../hooks/useSearch';
import { getCurrentPlayer } from '../services/player';
import { getGames } from '../services/game';
import { getPlayerAchievementsForGame } from '../services/achievements';
import type { GameWithAchievements, Achievement as AchievementType } from '../model/types';
import './AchievementsPage.scss';

const AchievementsPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [expandedGames, setExpandedGames] = useState<Set<string>>(new Set());

    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['games'],
        queryFn: getGames
    });

    const { data: allAchievements, isLoading: isLoadingAchievements } = useQuery({
        queryKey: ['allAchievements', player?.playerId],
        queryFn: async () => {
            if (!player || !games) return [];

            const achievementsPromises = games.map(game =>
                getPlayerAchievementsForGame(player.playerId, game.id)
                    .then((data: { achievements: any; }) => ({
                        gameId: game.id,
                        gameName: game.description,
                        achievements: data.achievements
                    }))
                    .catch(() => ({
                        gameId: game.id,
                        gameName: game.description,
                        achievements: []
                    }))
            );

            return Promise.all(achievementsPromises);
        },
        enabled: !!player && !!games
    });

    const { searchQuery, searchResults, isLoading: isSearching, handleSearch } = useSearch<GameWithAchievements>({
        data: allAchievements || [],
        searchField: 'gameName',
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
    const isLoading = isLoadingGames || isLoadingAchievements;

    return (
        <div className="page">
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
                {(isSearching || isLoading) && <span className="loading-spinner">⏳</span>}
            </div>

            <div className="achievements-content">
                <h1>Achievements</h1>

                {isLoading && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        Loading achievements...
                    </p>
                )}

                {!isLoading && showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No games found</h2>
                        <p>Try a different search...</p>
                    </div>
                )}

                {!isLoading && (
                    <div className="games-list">
                        {searchResults.map((game) => {
                            const isExpanded = expandedGames.has(game.gameId);
                            const achievedCount = game.achievements.filter((a) => a.unlocked).length;
                            const toBeAchievedCount = game.achievements.filter((a) => !a.unlocked).length;

                            if (game.achievements.length === 0) return null;

                            return (
                                <div key={game.gameId} className="game-card">
                                    <div className="game-header" onClick={() => toggleGame(game.gameId)}>
                                        <div className="game-title">
                                            <span className="game-name">{game.gameName}</span>
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
                                                    <h3>My badges ({achievedCount})</h3>
                                                    <div className="achievements-grid">
                                                        {game.achievements
                                                            .filter((a) => a.unlocked)
                                                            .map((achievement) => (
                                                                <Achievement
                                                                    key={achievement.id}
                                                                    icon={getAchievementIcon(achievement)}
                                                                    name={achievement.name}
                                                                    description={achievement.description}
                                                                    achieved={achievement.unlocked}
                                                                    onClick={() => handleAchievementClick(achievement.id)}
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {toBeAchievedCount > 0 && (
                                                <div className="achievement-section">
                                                    <h3>To Be Achieved ({toBeAchievedCount})</h3>
                                                    <div className="achievements-grid">
                                                        {game.achievements
                                                            .filter((a) => !a.unlocked)
                                                            .map((achievement) => (
                                                                <Achievement
                                                                    key={achievement.id}
                                                                    icon={getAchievementIcon(achievement)}
                                                                    name={achievement.name}
                                                                    description={achievement.description}
                                                                    achieved={achievement.unlocked}
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
                )}
            </div>
        </div>
    );
};

// Helper function to map achievement criteria to icons
function getAchievementIcon(achievement: AchievementType): string {
    try {
        const criteria = JSON.parse(achievement.criteria);
        const iconMap: Record<string, string> = {
            'WINS_COUNT': '🏆',
            'WIN_STREAK': '🔥',
            'GAMES_PLAYED': '🎮',
            'SCORE_THRESHOLD': '⭐',
            'KILLS_COUNT': '⚔️',
            'PERFECT_GAME': '💎'
        };
        return iconMap[criteria.type] || '🏅';
    } catch {
        return '🏅';
    }
}

export default AchievementsPage;