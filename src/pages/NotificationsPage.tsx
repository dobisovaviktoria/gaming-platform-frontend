// pages/NotificationsPage.tsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
import Notification from '../components/Notification';
import './NotificationsPage.scss';
import {useSearch} from "../hooks/useSearch.ts";
import {useNotifications} from "../hooks/useNotifications.ts";
import {useNavigate} from "react-router-dom";

interface DisplayNotification {
    redirect: string;
    message: string;
    icon: string;
    stamp: Date | undefined;
}

const NotificationsPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const {notifications, isLoading:isLoadingFetch, isError:isErrorFetch} = useNotifications();

    const displayNotifications: DisplayNotification[] = notifications?.map((notification) => {
        const result : DisplayNotification = {
            redirect: '',
            message: notification.content,
            icon: '',
            stamp: new Date(notification.stamp)
        }
        switch (notification.type) {
            case "FRIEND_REQUEST":
                result.icon = '❔';
                result.redirect = '/friends';
                break;
            case "GAME_INVITE":
                result.icon = '🎮';
                result.redirect = '/game/'+notification.relatedId;
                break;
            case "GAME_ACHIEVEMENT":
                result.icon = '🥇';
                result.redirect = '/game/'+notification.relatedId+'/statistics';
                break;
            case "APP_ACHIEVEMENT":
                result.icon = '🏆';
                result.redirect = '/achievements';
                break;
            case "FRIEND_ADDED":
                result.icon = '👫';
                result.redirect = '/friends';
                break;

        }
        return result;
    }) || []

    displayNotifications.sort((notif1, notif2) => (notif2.stamp?.getTime() || 0) - (notif1.stamp?.getTime() || 0))

    const { searchQuery, searchResults, isLoading:isLoadingSearch, error, handleSearch } = useSearch<DisplayNotification>({
        data: displayNotifications,
        searchField: 'message',
    });

    const handleNotificationClick = (url: string) => {
        console.log(url);
        navigate(url);
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

    const isLoading = isLoadingFetch || isLoadingSearch;
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

                {isErrorFetch && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>Problems loading</h2>
                        <p>Could not retrieve notifications...</p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div className="notifications-list">
                        {searchResults.map((notification) => (
                            <Notification
                                key={Math.random().toString()}
                                message={notification.message}
                                icon={notification.icon}
                                onClick={() => handleNotificationClick(notification.redirect)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
