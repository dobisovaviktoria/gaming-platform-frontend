import './Notification.scss';

interface NotificationProps {
    message: string;
    icon?: string;
    onClick?: () => void;
}

export default function Notification({ message, icon = '🔔', onClick } : NotificationProps) {
    return (
        <div className="notification-card" onClick={onClick}>
            <div className="notification-icon">{icon}</div>
            <div className="notification-content">
                <p>{message}</p>
            </div>
        </div>
);
};