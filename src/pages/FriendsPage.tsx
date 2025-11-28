import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFriends, getFriendRequests, acceptFriendRequest, rejectFriendRequest, type PlayerBasicInfo, type FriendRequest } from '../services/player';
import Navbar from '../components/Navbar';
import SideMenu from '../components/overlays/SideMenu.tsx';
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
    const queryClient = useQueryClient();

    const { data: friends, isLoading: isLoadingFriends, error: friendsError } = useQuery<PlayerBasicInfo[], Error>({
        queryKey: ['friends'],
        queryFn: getFriends
    });

    const { data: requests, isLoading: isLoadingRequests } = useQuery<FriendRequest[], Error>({
        queryKey: ['friendRequests'],
        queryFn: getFriendRequests
    });

    const acceptMutation = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    });

    const rejectMutation = useMutation({
        mutationFn: rejectFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        }
    });

    const friendsData: Friend[] = friends?.map(f => ({
        id: f.playerId,
        username: f.username,
        avatarUrl: '/avatars/default.jpg'
    })) || [];

    const { searchQuery, searchResults, handleSearch } = useSearch<Friend>({
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

    const handleAccept = (friendshipId: string) => {
        acceptMutation.mutate(friendshipId);
    };

    const handleReject = (friendshipId: string) => {
        rejectMutation.mutate(friendshipId);
    };

    const showNoResults = searchQuery.trim().length > 0 && searchResults.length === 0 && !friendsError;

    return (
        <div className="friends-page">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                />
                {isLoadingFriends && <span className="loading-spinner">⏳</span>}
            </div>

            {!isLoadingRequests && requests && requests.length > 0 && (
                <div className="friend-requests-section">
                    <h2>Friend Requests</h2>
                    <div className="requests-list">
                        {requests.map((req) => (
                            <div key={req.friendshipId} className="request-item">
                                <div className="request-info">
                                    <div className="request-avatar">
                                        <img src="/avatars/default.jpg" alt={req.requesterName} />
                                    </div>
                                    <span className="request-name">{req.requesterName}</span>
                                </div>
                                <div className="request-actions">
                                    <button 
                                        className="btn-accept"
                                        onClick={() => handleAccept(req.friendshipId)}
                                        disabled={acceptMutation.isPending}
                                    >
                                        Accept
                                    </button>
                                    <button 
                                        className="btn-reject"
                                        onClick={() => handleReject(req.friendshipId)}
                                        disabled={rejectMutation.isPending}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="search-results">
                {friendsError && (
                    <div className="error-message">
                        <p>{friendsError.message}</p>
                    </div>
                )}

                <div className="friends-header">
                    <h1>My Friends</h1>
                    <Link className="btn-add" to="/friends/add" >
                        Add
                    </Link>
                </div>

                {showNoResults && (
                    <div className="no-results">
                        <div className="sad-face">☹️</div>
                        <h2>No friends found</h2>
                        <p>Try a different search...</p>
                    </div>
                )}


                {searchResults.length > 0 ? (
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
                ) : (
                    !showNoResults && !isLoadingFriends && (
                        <div className="no-friends-placeholder">
                            <p>You haven't added any friends yet.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
