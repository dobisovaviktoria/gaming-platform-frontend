import {useState} from 'react';
import {Box} from '@mui/material';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import ProfileHeader from '../../components/profile/ProfileHeader.tsx';
import ProfileStats from '../../components/profile/ProfileStats.tsx';
import ProfileLevelProgress from '../../components/profile/ProfileLevelProgress.tsx';
import ProfileLevelSystem from '../../components/profile/ProfileLevelSystem.tsx';

export default function ProfilePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const handleMenuClose = () => setIsMenuOpen(false);

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <Box p={3} maxWidth="1400px" mx="auto">
                <ProfileHeader />
                <ProfileStats />
                <ProfileLevelProgress />
                <ProfileLevelSystem />
            </Box>
        </Box>
    );
}