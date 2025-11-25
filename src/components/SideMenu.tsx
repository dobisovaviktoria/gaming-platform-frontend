import React from 'react';
import './SideMenu.scss';
import { Link } from "react-router";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const menuItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Friends', path: '/friends' },
        { label: 'Add Your Game', path: '/add-game' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Profile', path: '/profile' },
    ];

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className={`menu-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Side menu */}
            <div className={`side-menu ${isOpen ? 'open' : ''}`}>
                <div className="menu-header">
                    <h3>Menu</h3>
                    <button className="btn-close" onClick={onClose} aria-label="Close menu">
                        ✕
                    </button>
                </div>

                <nav className="menu-content">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className="link-btn" key={item.label}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default SideMenu;
