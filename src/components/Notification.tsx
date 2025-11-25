import React from 'react';
import './Notification.scss';

interface NotificationProps {
    message: string;
    icon?: string;
    onClick?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, icon = '🔔', onClick }) => {
    return (
        <div className="notification-card" onClick={onClick}>
            <div className="notification-icon">{icon}</div>
            <div className="notification-content">
                <p>{message}</p>
            </div>
        </div>
);
};

export default Notification;
