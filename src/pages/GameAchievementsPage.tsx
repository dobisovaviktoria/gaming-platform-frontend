import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Achievement from '../components/Achievement';
import './GameAchievementsPage.scss';

interface AchievementData {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
}

const GameAchievementsPage: React.FC = () => {
    const navigate = useNavigate();
    const { gameId } = useParams();

    // Mock data - replace with API call based on gameId
    const achievements: AchievementData[] = [
        { id: '1', name: 'First Win', description: 'Win your first game', icon: '🏆', achieved: true },
        { id: '2', name: 'Win Streak', description: 'Win 5 games in a row', icon: '🔥', achieved: true },
        { id: '3', name: 'Perfect Game', description: 'Win without opponent scoring', icon: '⭐', achieved: true },
        { id: '4', name: 'Master', description: 'Win 50 games total', icon: '👑', achieved: true },
        { id: '5', name: 'Grand Master', description: 'Win 100 games total', icon: '💎', achieved: true },
        { id: '6', name: 'Legend', description: 'Win 250 games total', icon: '🌟', achieved: true },
        { id: '7', name: 'Unbeatable', description: 'Win 50 games in a row', icon: '🛡️', achieved: false },
        { id: '8', name: 'Champion', description: 'Reach rank #1', icon: '🥇', achieved: false },
        { id: '9', name: 'Tactician', description: 'Use special moves 100 times', icon: '🎯', achieved: false },
        { id: '10', name: 'Speed Demon', description: 'Win in under 60 seconds', icon: '⚡', achieved: false },
        { id: '11', name: 'Comeback King', description: 'Win from losing position', icon: '🔄', achieved: false },
        { id: '12', name: 'Marathon', description: 'Play 1000 games', icon: '🎮', achieved: false },
        { id: '13', name: 'Teacher', description: 'Help 10 new players', icon: '📚', achieved: false },
        { id: '14', name: 'Social Butterfly', description: 'Add 50 friends', icon: '🦋', achieved: false },
        { id: '15', name: 'Collector', description: 'Unlock all achievements', icon: '💯', achieved: false },
    ];

    const achievedBadges = achievements.filter(a => a.achieved);
    const lockedBadges = achievements.filter(a => !a.achieved);

    const handleBackClick = () => {
        navigate(`/game/${gameId}/`);
    };

    const handleAchievementClick = (achievementId: string) => {
        console.log('Achievement clicked:', achievementId);
    };

    return (
        <div className="game-achievements-page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>Achievements</h1>
            </div>

            <div className="achievements-sections">
                {achievedBadges.length > 0 && (
                    <div className="achievement-section">
                        <h2>My badges</h2>
                        <div className="achievements-grid">
                            {achievedBadges.map((achievement) => (
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

                {lockedBadges.length > 0 && (
                    <div className="achievement-section">
                        <h2>To Be Achieved</h2>
                        <div className="achievements-grid">
                            {lockedBadges.map((achievement) => (
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
        </div>
    );
};

export default GameAchievementsPage;
