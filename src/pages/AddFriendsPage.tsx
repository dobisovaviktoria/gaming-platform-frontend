import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import './AddFriendsPage.scss';

interface User {
    id: string;
    username: string;
    avatarUrl: string;
}

const AddFriendsPage: React.FC = () => {
    const navigate = useNavigate();
    const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());

    // Mock data - replace with API call
    const allUsers: User[] = [
        { id: '1', username: 'Brittany Dinan', avatarUrl: '/avatars/brittany1.jpg' },
        { id: '2', username: 'John Smith', avatarUrl: '/avatars/john.jpg' },
        { id: '3', username: 'Sarah Johnson', avatarUrl: '/avatars/sarah.jpg' },
        { id: '4', username: 'Mike Wilson', avatarUrl: '/avatars/mike.jpg' },
        { id: '5', username: 'Emily Brown', avatarUrl: '/avatars/emily.jpg' },
        { id: '6', username: 'David Lee', avatarUrl: '/avatars/david.jpg' },
        { id: '7', username: 'Lisa Anderson', avatarUrl: '/avatars/lisa.jpg' },
        { id: '8', username: 'James Taylor', avatarUrl: '/avatars/james.jpg' },
    ];

    const { searchQuery, searchResults, handleSearch } = useSearch<User>({
        data: allUsers,
        searchField: 'username',
    });

    const handleBackClick = () => {
        navigate('/friends');
    };

    const handleAddFriend = (userId: string) => {
        setAddedFriends((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });

        console.log('Friend request sent to user:', userId);
        // Add API call to send friend request
    };

    const shouldShowResults = searchQuery.trim().length > 2;

    return (
        <div className="add-friends-page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>People</h1>
            </div>

            <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            {shouldShowResults && (
                <div className="users-list">
                    {searchResults.length === 0 ? (
                        <div className="no-results">
                            <p>No users found</p>
                        </div>
                    ) : (
                        searchResults.map((user) => {
                            const isAdded = addedFriends.has(user.id);

                            return (
                                <div key={user.id} className="user-item">
                                    <div className="user-avatar">
                                        <img src={user.avatarUrl} alt={user.username} />
                                    </div>
                                    <span className="user-name">{user.username}</span>
                                    <button
                                        className={`btn-add ${isAdded ? 'added' : ''}`}
                                        onClick={() => handleAddFriend(user.id)}
                                        aria-label={isAdded ? 'Remove friend request' : 'Add friend'}
                                    >
                                        {isAdded ? '✓' : '+'}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {!shouldShowResults && searchQuery.trim().length > 0 && (
                <div className="search-hint">
                    <p>Type at least 3 characters to search</p>
                </div>
            )}
        </div>
    );
};

export default AddFriendsPage;
