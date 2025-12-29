import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation} from '@tanstack/react-query';
import {Box, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Button, Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import {getAllPlayers, addFriend} from '../../services/player.ts';

interface User {
    id: string;
    username: string;
    avatarUrl: string;
    alreadyConnected: boolean;
}

export default function AddFriendsPage() {
    const navigate = useNavigate();
    const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');

    const { data: players } = useQuery({
        queryKey: ['players'],
        queryFn: getAllPlayers,
    });

    const allUsers: User[] =
        players?.map((p) => ({
            id: p.playerId,
            username: p.username,
            avatarUrl: '/avatars/default.jpg',
            alreadyConnected: p.alreadyConnected,
        })) || [];

    const addFriendMutation = useMutation({
        mutationFn: addFriend,
        onSuccess: (_, variables) => {
            setAddedFriends((prev) => new Set(prev).add(variables));
        },
    });

    const handleAddFriend = (userId: string) => {
        if (addedFriends.has(userId)) return;
        addFriendMutation.mutate(userId);
    };

    const handleBackClick = () => {
        navigate('/friends');
    };

    const shouldShowResults = true;

    return (
        <Box>
            <Box p={3}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Button onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
                        Back
                    </Button>
                    <Typography variant="h5">People</Typography>
                </Box>

                <Box position="relative" mb={4}>
                    <TextField
                        fullWidth
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>

                {shouldShowResults && (
                    <List>
                        {allUsers
                            .filter((user) =>
                                user.username
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                            )
                            .map((user) => {
                                const isAdded = addedFriends.has(user.id);

                                return (
                                    <Paper key={user.id} elevation={2} sx={{mb: 2}}>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemAvatar>
                                                    <Avatar src={user.avatarUrl} />
                                                </ListItemAvatar>
                                                <ListItemText primary={user.username} />
                                            </ListItemButton>

                                            {!user.alreadyConnected && (
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => handleAddFriend(user.id)}
                                                    disabled={isAdded}
                                                    sx={{mr: 2}}
                                                >
                                                    {isAdded ? 'Sent' : '+'}
                                                </Button>
                                            )}
                                        </ListItem>
                                    </Paper>
                                );
                            })}
                    </List>
                )}
            </Box>
        </Box>
    );
}
