import {Dialog, DialogTitle, DialogContent, Button, Typography, Box, IconButton, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReplayIcon from '@mui/icons-material/Replay';
import HomeIcon from '@mui/icons-material/Home';
import {useNavigate} from 'react-router-dom';

type GameResult = 'win' | 'loss' | 'draw';

interface GameEndOverlayProps {
    isOpen: boolean;
    result: GameResult;
    gameId: string;
    onPlayAgain: () => void;
    onClose?: () => void;
}

const resultConfig = {
    win: {title: 'You Won!', color: 'success'},
    loss: {title: 'You Lost!', color: 'error'},
    draw: {title: 'Draw', color: 'warning'},
};

export default function GameEndOverlay({isOpen, result, gameId, onPlayAgain, onClose}: GameEndOverlayProps) {
    const navigate = useNavigate();
    const {title, color} = resultConfig[result];

    const handleSeeStats = () => {
        navigate(`/game/${gameId}/statistics`);
        onClose?.();
    };

    const handlePlayAgain = () => {
        onPlayAgain();
        onClose?.();
    };

    const handleGoHome = () => {
        navigate('/');
        onClose?.();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" color={`${color}.main`}>
                        {title}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={2}>
                    <Button
                        variant="outlined"
                        startIcon={<BarChartIcon />}
                        onClick={handleSeeStats}
                        fullWidth
                        size="large"
                    >
                        See My Stats
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<ReplayIcon />}
                        onClick={handlePlayAgain}
                        fullWidth
                        size="large"
                    >
                        Play Again
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<HomeIcon />}
                        onClick={handleGoHome}
                        fullWidth
                        size="large"
                    >
                        Go Home
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}