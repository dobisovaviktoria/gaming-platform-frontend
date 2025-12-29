import {Box, Typography, Avatar} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {getCurrentPlayer} from '../../services/player.ts';

export default function ProfileHeader() {
    const {data: player, isLoading} = useQuery({
        queryKey: ['currentPlayer'],
        queryFn: getCurrentPlayer,
    });

    if (isLoading || !player) return null;

    const avatarLetter = player.username.charAt(0).toUpperCase();

    return (
        <Box className="profile-header">
            <Avatar className="profile-avatar">{avatarLetter}</Avatar>
            <Typography variant="h5" className="profile-username">
                {player.username}
            </Typography>
        </Box>
    );
}