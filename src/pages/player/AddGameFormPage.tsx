import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Typography, TextField, Button, Stack, Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useAddGame} from "../../hooks/useGame.ts";

interface GameFormData {
    url: string;
    name: string;
    pictureUrl: string;
    description: string;
    rules: string;
    maxPlayers: number;
}

export default function AddGameFormPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<GameFormData>({
        name: '',
        url: '',
        pictureUrl: '',
        description: '',
        rules: '',
        maxPlayers: 2,
    });

    const onSuccess = () => navigate('/add-game');

    const {addNewGame} = useAddGame(onSuccess);

    const handleBackClick = () => {
        navigate('/add-game');
    };

    const handleInputChange = (field: keyof GameFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNewGame(formData);
    };

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Button onClick={handleBackClick} startIcon={<ArrowBackIcon />}>
                    Back
                </Button>
                <Typography variant="h5">Adding Game</Typography>
            </Box>

            <Paper elevation={3}>
                <Box p={4}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Game Name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Game URL"
                                value={formData.url}
                                onChange={(e) => handleInputChange('url', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Game Picture URL"
                                value={formData.pictureUrl}
                                onChange={(e) => handleInputChange('pictureUrl', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Game Description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Game Rules"
                                value={formData.rules}
                                onChange={(e) => handleInputChange('rules', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Max Players"
                                type="number"
                                value={formData.maxPlayers}
                                onChange={(e) => handleInputChange('maxPlayers', Number(e.target.value))}
                                fullWidth
                                required
                            />

                            <Button type="submit" variant="contained" size="large">
                                Add Game
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
}