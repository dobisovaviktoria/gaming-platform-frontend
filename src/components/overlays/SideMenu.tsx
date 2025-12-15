import './SideMenu.scss';
import { Link } from "react-router";
import {useKeycloak} from "../../contexts/AuthContext.tsx";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideMenu({ isOpen, onClose } : SideMenuProps) {
    const { logout, user: { realm_access: { roles } } } = useKeycloak();

    const menuItems = [
        { label: 'Dashboard', path: '/' },
        { label: 'Friends', path: '/friends' },
        { label: 'Add Your Game', path: '/add-game' },
        { label: 'Achievements', path: '/achievements' },
        { label: 'Profile', path: '/profile' },
    ];
    const adminMenuItems = [
        { label: 'Admin Dashboard', path: '/admin/' },
        { label: 'Waiting Games', path: '/admin/games' },
    ];

    const handleLogout = () => {
        logout();
        onClose();
    };

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
                                <Link to={item.path} className="link-btn" key={item.label} onClick={onClose}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        {roles.includes('admin') && adminMenuItems.map((item, index) => (
                            <li key={index}>
                                <Link to={item.path} className="link-btn" key={item.label} onClick={onClose}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button className="btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </div>
        </>
    );
};