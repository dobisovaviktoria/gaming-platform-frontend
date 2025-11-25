import React from 'react';
import './PersonCard.scss';

interface PersonCardProps {
    id: string;
    username: string;
    avatarUrl: string;
    onClick?: (id: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ id, username, avatarUrl, onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <div className="person-card" onClick={handleClick}>
            <div className="person-avatar">
                <img src={avatarUrl} alt={username} />
            </div>
            <p className="person-name">{username}</p>
        </div>
    );
};

export default PersonCard;
