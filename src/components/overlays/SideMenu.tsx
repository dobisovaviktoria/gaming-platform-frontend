import {Drawer, Box, IconButton, Typography, List, ListItem, ListItemButton, ListItemText, Divider, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Link} from "react-router-dom";
import {useKeycloak} from "../../contexts/AuthContext.tsx";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideMenu({isOpen, onClose}: SideMenuProps) {
    const {logout, user: {realm_access: {roles}}} = useKeycloak();

    const menuItems = [
        {label: 'Dashboard', path: '/'},
        {label: 'Friends', path: '/friends'},
        {label: 'Add Your Game', path: '/add-game'},
        {label: 'Achievements', path: '/achievements'},
        {label: 'Profile', path: '/profile'},
    ];

    const adminMenuItems = [
        {label: 'Admin Dashboard', path: '/admin/'},
        {label: 'Waiting Games', path: '/admin/games'},
    ];

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <Box width={300} role="presentation">
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <Typography variant="h6">Menu</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton component={Link} to={item.path} onClick={onClose}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {roles.includes('admin') && adminMenuItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton component={Link} to={item.path} onClick={onClose}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box p={2}>
                    <Button variant="outlined" color="error" onClick={handleLogout} fullWidth>
                        Logout
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}