import {Avatar, Typography, Box} from '@mui/material';

interface PersonCardProps {
    id: string;
    username: string;
    avatarUrl: string;
    onClick?: (id: string) => void;
}

export default function PersonCard({id, username, avatarUrl, onClick}: PersonCardProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <Box textAlign="center" onClick={handleClick} sx={{cursor: 'pointer', width: 100, overflow: 'hidden'}}>
            <Avatar src={avatarUrl} alt={username} sx={{width: 100, height: 100, mb: 1}} />
            <Typography variant="body1">{username}</Typography>
        </Box>
    );
}