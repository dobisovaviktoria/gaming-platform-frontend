import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import PersonCard from '../components/PersonCard';
import { useSearch } from '../hooks/useSearch';
import './FriendsPage.scss';
import { Link } from "react-router";

interface Friend {
    id: string;
    username: string;
    avatarUrl: string;
}

const FriendsPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Mock friends data - replace with API call later
    const friendsData: Friend[] = [
        { id: '1', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany1.jpg' },
        { id: '2', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany2.jpg' },
        { id: '3', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany3.jpg' },
        { id: '4', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany4.jpg' },
        { id: '5', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany5.jpg' },
    ];

    const { searchQuery, searchResults, isLoading, error, handleSearch } = useSearch<Friend>({
        data: friendsData,
        searchField: 'username',
    });

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

    const handleFriendClick = (friendId: string) => {
        console.log('Friend clicked:', friendId);
        // Navigate to friend profile
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !error;

    return (
        <div className="friends-page">
            <Navbar onMenuToggle={handleMenuToggle} />

            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search friends"
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
                        <h2>No friends found</h2>
                        <p>Try a different search...</p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <>
                        <div className="friends-header">
                            <h1>My Friends</h1>
                            <Link className="btn-add" to="/friends/add" >
                                Add
                            </Link>
                        </div>

                        <div className="friends-grid">
                            {searchResults.map((friend) => (
                                <PersonCard
                                    key={friend.id}
                                    id={friend.id}
                                    username={friend.username}
                                    avatarUrl={friend.avatarUrl}
                                    onClick={handleFriendClick}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
