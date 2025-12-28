import {Dialog, DialogTitle, DialogContent, Button, Typography, Box, IconButton, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface GameModeOverlayProps {
    isOpen: boolean;
    url: string;
    showLobby: () => void;
    onClose: () => void;
}

export default function GameModeOverlay({isOpen, showLobby, url, onClose}: GameModeOverlayProps) {
    const handleAgainstAI = () => {
        window.location.href = `${url}?mode=ai`;
        onClose();
    };

    const handleHumanGame = () => {
        showLobby();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Mode</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Button
                        variant="contained"
                        startIcon={<SmartToyIcon />}
                        onClick={handleAgainstAI}
                        fullWidth
                        size="large"
                    >
                        Against AI
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PersonIcon />}
                        onClick={handleHumanGame}
                        fullWidth
                        size="large"
                    >
                        Against another person
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}