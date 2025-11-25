import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import './ProfilePage.scss';

interface ProfileData {
    email: string;
    phone: string;
    location: string;
    password: string;
}

const ProfilePage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = {
        avatarUrl: "example.png",
        username: "Brittany Dinan",
    };

    const [profileData, setProfileData] = useState<ProfileData>({
        email: 'email@email.com',
        phone: '(+123) 000 111 222 333',
        location: 'New York, USA',
        password: '************',
    });

    const [isEditing, setIsEditing] = useState(false);

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

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = () => {
        console.log('Updating profile:', profileData);
        // Add API call to update profile
        setIsEditing(false);
    };

    return (
        <div className="profile-page">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            <img
                                src={user?.avatarUrl || '/default-avatar.png'}
                                alt={user?.username || 'User'}
                            />
                        </div>
                        <h2 className="profile-name">{user?.username || 'Brittany Dinan'}</h2>
                    </div>

                    <div className="profile-fields">
                        <div className="profile-field">
                            <label>Email</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Location</label>
                            <input
                                type="text"
                                value={profileData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Change password</label>
                            <input
                                type="password"
                                value={profileData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                Edit
                            </button>
                        ) : (
                            <>
                                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                                <button className="btn-update" onClick={handleUpdate}>
                                    Update
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
