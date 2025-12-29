import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Box, Typography, TextField, InputAdornment, List, ListItem, ListItemButton, ListItemText, Paper, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import {getGames} from '../../services/game.ts';

export default function SearchPage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const { data: games = [] } = useQuery({
        queryKey: ['games'],
        queryFn: getGames,
    });

    const filteredGames = games.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Button onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
                    Back
                </Button>
                <Typography variant="h5">Search</Typography>
            </Box>

            <Box mb={4}>
                <TextField
                    fullWidth
                    placeholder="Search games..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    autoFocus
                />
            </Box>

            <Paper elevation={2}>
                <List>
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                            <ListItem key={game.id} disablePadding>
                                <ListItemButton onClick={() => navigate(`/game/${game.id}`)}>
                                    <ListItemText
                                        primary={game.name}
                                        secondary={`${game.maxPlayers} players`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText
                                primary="No games found"
                            />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </Box>
    );
}