import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    open?: boolean;
}

export default function ConfirmationDialog({
                                               message,
                                               onConfirm,
                                               onCancel,
                                               open = true,
                                           }: ConfirmationDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}