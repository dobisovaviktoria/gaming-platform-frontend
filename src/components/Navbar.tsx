import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

interface NavbarProps {
    onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
    const navigate = useNavigate();
    const user = {
        avatarUrl: "/path-to-avatar.jpg",
        username: "testUser"
    };

    const handleNotificationClick = () => {
        navigate('/notifications');
    };

    const handleMenuClick = () => {
        onMenuToggle();
    };

    return (
        <header className="navbar">
            <button
                className="btn-notification"
                aria-label="Notifications"
                onClick={handleNotificationClick}
            >
                🔔
            </button>

            <div className="navbar-right">
                <div className="profile-avatar">
                    <img
                        src={user?.avatarUrl || '/default-avatar.png'}
                        alt={user?.username || 'User profile'}
                    />
                </div>
                <button
                    className="btn-menu"
                    aria-label="Menu"
                    onClick={handleMenuClick}
                >
                    ☰
                </button>
            </div>
        </header>
    );
};

export default Navbar;
