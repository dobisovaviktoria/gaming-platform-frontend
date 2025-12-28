import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Typography, Stack, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type {DataGenerationConfig} from "../../model/types.ts";

interface AISetupOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    mutate: (config: DataGenerationConfig) => void;
}

const games = ['Tic Tac Toe'];

export default function AISetupOverlay({ isOpen, onClose, mutate }: AISetupOverlayProps) {
    const [selectedGame, setSelectedGame] = useState('Tic Tac Toe');
    const [numberOfGames, setNumberOfGames] = useState(100);

    const handleStart = () => {
        const config: DataGenerationConfig = {
            game: selectedGame,
            plays: numberOfGames,
        };
        mutate(config);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">AI vs AI</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} mt={1}>
                    <FormControl fullWidth>
                        <InputLabel>Game</InputLabel>
                        <Select
                            value={selectedGame}
                            label="Game"
                            onChange={(e) => setSelectedGame(e.target.value as string)}
                        >
                            {games.map((game) => (
                                <MenuItem key={game} value={game}>{game}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Runs"
                        type="number"
                        value={numberOfGames}
                        onChange={(e) => setNumberOfGames(Number(e.target.value))}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleStart} variant="contained" size="large">
                    Start
                </Button>
            </DialogActions>
        </Dialog>
    );
}