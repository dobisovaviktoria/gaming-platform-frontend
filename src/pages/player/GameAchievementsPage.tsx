import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Achievement from '../../components/Achievement.tsx';
import { getCurrentPlayer } from '../../services/player.ts';
import { getPlayerAchievementsForGame } from '../../services/achievements.ts';
import './GameAchievementsPage.scss';

const GameAchievementsPage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();

    const { data: player } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: achievementsData, isLoading } = useQuery({
        queryKey: ['gameAchievements', player?.playerId, gameId],
        queryFn: () => {
            if (!player || !gameId) throw new Error('Missing player or gameId');
            return getPlayerAchievementsForGame(player.playerId, gameId);
        },
        enabled: !!player && !!gameId
    });

    const handleBackClick = () => {
        navigate(`/game/${gameId}/`);
    };

    const handleAchievementClick = (achievementId: string) => {
        console.log('Achievement clicked:', achievementId);
    };

    if (isLoading) {
        return (
            <div className="game-achievements-page">
                <div className="page-header">
                    <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                        ←
                    </button>
                    <h1>Achievements</h1>
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    Loading achievements...
                </p>
            </div>
        );
    }

    const achievements = achievementsData?.achievements || [];
    const achievedBadges = achievements.filter(a => a.unlocked);
    const lockedBadges = achievements.filter(a => !a.unlocked);

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>Achievements</h1>
            </div>

            {achievements.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                    No achievements available for this game yet.
                </p>
            ) : (
                <div className="achievements-sections">
                    {achievedBadges.length > 0 && (
                        <div className="achievement-section">
                            <h2>My badges ({achievedBadges.length}/{achievements.length})</h2>
                            <div className="achievements-grid">
                                {achievedBadges.map((achievement) => (
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

                    {lockedBadges.length > 0 && (
                        <div className="achievement-section">
                            <h2>To Be Achieved</h2>
                            <div className="achievements-grid">
                                {lockedBadges.map((achievement) => (
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
};

// Helper function to map achievement criteria to icons
function getAchievementIcon(achievement: any): string {
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

export default GameAchievementsPage;