import './PersonCard.scss';

interface PersonCardProps {
    id: string;
    username: string;
    avatarUrl: string;
    onClick?: (id: string) => void;
}

export default function PersonCard({ id, username, avatarUrl, onClick } : PersonCardProps) {
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