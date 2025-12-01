import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllPlayers, addFriend, type PlayerSearchResponse } from '../services/player';
import { useSearch } from '../hooks/useSearch';
import './AddFriendsPage.scss';

interface User {
    id: string;
    username: string;
    avatarUrl: string;
    alreadyConnected: boolean;
}

const AddFriendsPage: React.FC = () => {
    const navigate = useNavigate();
    const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());

    const { data: players, isLoading, error } = useQuery<PlayerSearchResponse[], Error>({
        queryKey: ['players'],
        queryFn: getAllPlayers
    });

    const allUsers: User[] = players?.map(p => ({
        id: p.playerId,
        username: p.username,
        avatarUrl: '/avatars/default.jpg',
        alreadyConnected: p.alreadyConnected
    })) || [];

    const { searchQuery, searchResults, handleSearch } = useSearch<User>({
        data: allUsers,
        searchField: 'username',
    });

    const handleBackClick = () => {
        navigate('/friends');
    };

    const addFriendMutation = useMutation({
        mutationFn: addFriend,
        onSuccess: (_, variables) => {
            setAddedFriends((prev) => {
                const newSet = new Set(prev);
                newSet.add(variables);
                return newSet;
            });
        },
        onError: (error) => {
            console.error('Failed to send friend request:', error);
            alert('Failed to send friend request. Please try again.');
        }
    });

    const handleAddFriend = (userId: string) => {
        if (addedFriends.has(userId)) return;
        addFriendMutation.mutate(userId);
    };

    const shouldShowResults = searchQuery.trim().length > 2;

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>People</h1>
            </div>

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isLoading && <span className="loading-spinner">⏳</span>}
            </div>

            {error && <div className="error-message">Error loading players: {error.message}</div>}

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
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <img src={user.avatarUrl} alt={user.username} />
                                        </div>
                                        <span className="user-name">{user.username}</span>
                                    </div>
                                    {!user.alreadyConnected && (
                                        <button
                                            className={`btn-add ${isAdded ? 'added' : ''}`}
                                            onClick={() => handleAddFriend(user.id)}
                                            disabled={isAdded || addFriendMutation.isPending}
                                            aria-label={isAdded ? 'Friend request sent' : 'Add friend'}
                                        >
                                            {isAdded ? 'Sent' : '+'}
                                        </button>
                                    )}
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
