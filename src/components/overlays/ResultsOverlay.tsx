import {Dialog, DialogTitle, DialogContent, Button, Typography, Box, IconButton, Stack, List, ListItem, ListItemText} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type {DataGenerationResponse} from "../../model/types.ts";

interface ResultsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    results: DataGenerationResponse;
    onDelete: (file: string) => void;
    onSave: () => void;
}

export default function ResultsOverlay({isOpen, onClose, results, onDelete, onSave}: ResultsOverlayProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Generated Data</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3}>
                    <Typography variant="h5" align="center">Run Complete</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="P1 wins" secondary={results.wins} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Draws" secondary={results.draws} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="P2 wins" secondary={results.losses} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="File" secondary={results.file} />
                        </ListItem>
                    </List>
                </Stack>
            </DialogContent>
            <Box p={2} display="flex" gap={2}>
                <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(results.file)}
                    color="error"
                    fullWidth
                >
                    Delete
                </Button>
                <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={onSave}
                    fullWidth
                >
                    Done
                </Button>
            </Box>
        </Dialog>
    );
}