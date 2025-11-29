import React, { useState } from 'react';
import './Achievement.scss';

interface AchievementProps {
    icon: string;
    name: string;
    description?: string;
    achieved: boolean;
    onClick?: () => void;
}

const Achievement: React.FC<AchievementProps> = ({
                                                     icon,
                                                     name,
                                                     description,
                                                     achieved,
                                                     onClick
                                                 }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        setShowTooltip(!showTooltip);
        if (onClick) {
            onClick();
        }
    };
    const displayIcon = (icon === '' || icon === null) ? '🏆' : icon;

    return (
        <div
            className={`achievement ${achieved ? 'achieved' : 'locked'}`}
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className="achievement-icon">{displayIcon}</span>

            {showTooltip && (
                <div className="achievement-tooltip">
                    <h4>{name}</h4>
                    {description && <p>{description}</p>}
                    {!achieved && <span className="locked-badge">🔒 Locked</span>}
                </div>
            )}
        </div>
    );
};

export default Achievement;
