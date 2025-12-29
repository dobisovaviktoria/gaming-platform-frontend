import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Box, Typography, TextField, InputAdornment, Grid, Paper, Stack, Button, CircularProgress} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../../components/Navbar.tsx';
import SideMenu from '../../components/overlays/SideMenu.tsx';
import PersonCard from '../../components/PersonCard.tsx';
import {getFriends, getFriendRequests, acceptFriendRequest, rejectFriendRequest} from '../../services/player.ts';

export default function FriendsPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState('');

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {data: friends, isLoading: isLoadingFriends} = useQuery({
        queryKey: ['friends'],
        queryFn: getFriends,
    });

    const {data: requests} = useQuery({
        queryKey: ['friendRequests'],
        queryFn: getFriendRequests,
    });

    const acceptMutation = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
        },
    });

    const rejectMutation = useMutation({
        mutationFn: rejectFriendRequest,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] }),
    });

    const handleAccept = (friendshipId: string) =>
        acceptMutation.mutate(friendshipId);

    const handleReject = (friendshipId: string) =>
        rejectMutation.mutate(friendshipId);

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

    return (
        <Box>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Box p={3}>
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

                {requests && requests.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6">Friend Requests</Typography>
                        <Stack spacing={2} mt={2}>
                            {requests.map((req) => (
                                <Paper key={req.friendshipId} elevation={2}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        p={2}
                                    >
                                        <Typography>{req.requesterName}</Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleAccept(req.friendshipId)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleReject(req.friendshipId)}
                                            >
                                                Reject
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>
                )}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={4}
                    mb={2}
                >
                    <Typography variant="h5">My Friends</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/friends/add')}
                    >
                        Add
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {isLoadingFriends ? (
                        <Box textAlign="center" width="100%" my={4}>
                            <CircularProgress />
                        </Box>
                    ) : friends?.length ? (
                        friends
                            .filter((friend) =>
                                friend.username
                                    .toLowerCase()
                                    .includes(search.toLowerCase())
                            )
                            .map((friend) => (
                                <Grid
                                    size={{ xs: 6, sm: 4, md: 3 }}
                                    key={friend.playerId}
                                >
                                    <PersonCard
                                        id={friend.playerId}
                                        username={friend.username}
                                        avatarUrl="/avatars/default.jpg"
                                    />
                                </Grid>
                            ))
                    ) : (
                        <Typography color="text.secondary">
                            You haven't added any friends yet.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
