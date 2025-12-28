import {ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React from "react";

interface NotificationProps {
    message: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export default function Notification({message, icon, onClick}: NotificationProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick} sx={{py: 1.5}}>
                <ListItemAvatar>
                    <Avatar sx={{bgcolor: 'primary.main'}}>
                        {icon || <NotificationsIcon />}
                    </Avatar>
                </ListItemAvatar>

                <ListItemText
                    primary={
                        <Typography variant="body1" color="text.primary">
                            {message}
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}