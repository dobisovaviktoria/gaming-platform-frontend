// pages/NotificationsPage.tsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import Notification from '../components/Notification';
import './NotificationsPage.scss';
import {useSearch} from "../hooks/useSearch.ts";

interface NotificationData {
    id: string;
    message: string;
    icon?: string;
}

export default function NotificationsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const notifications: NotificationData[] = [
        {
            id: '1',
            message: 'You have been invited to play Tic Tac Toe by user Brianna',
            icon: '🔔',
        },
        {
            id: '2',
            message: 'You have been invited to play Tic Tac Toe by user Mark',
            icon: '🔔',
        },
        {
            id: '3',
            message: 'You have been invited to play Bang by user Brianna',
            icon: '🔔',
        },
        {
            id: '4',
            message: 'Your friend request was accepted by Brianna',
            icon: '🔔',
        },
    ];

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<NotificationData>({
        data: notifications,
        searchField: 'message',
    });

    const handleNotificationClick = (id: string) => {
        console.log('Notification clicked:', id);
    };

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

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="page">
            <Navbar
                onMenuToggle={handleMenuToggle}
            />

            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Connect 4"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            <div className="search-results">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No results found</h2>
                        <p>Try again...</p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div className="notifications-list">
                        {searchResults.map((notification) => (
                            <Notification
                                key={notification.id}
                                message={notification.message}
                                icon={notification.icon}
                                onClick={() => handleNotificationClick(notification.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};