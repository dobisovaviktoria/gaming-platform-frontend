import {Dialog, DialogContent, CircularProgress, Typography, Box} from '@mui/material';

interface LoadingOverlayProps {
    isOpen: boolean;
    message?: string;
}

export default function LoadingOverlay({isOpen, message}: LoadingOverlayProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} hideBackdrop disableEscapeKeyDown maxWidth="xs" fullWidth>
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3} py={4}>
                    <CircularProgress size={60} thickness={5} />
                    {message && <Typography variant="h6">{message}</Typography>}
                </Box>
            </DialogContent>
        </Dialog>
    );
}