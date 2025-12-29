import {useState} from 'react';
import {Box, Typography, IconButton, Collapse} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {LEVELS} from '../../model/types.ts';

export default function ProfileLevelSystem() {
    const [expanded, setExpanded] = useState(false);

    return (
        <Box className="profile-level-system">
            <Box
                className="profile-level-system-header"
                onClick={() => setExpanded(!expanded)}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'pointer', mb: 1 }}
            >
                <Typography variant="h6" className="profile-level-system-title">
                    Level System
                </Typography>
                <IconButton className="profile-expand-icon">
                    <ExpandMoreIcon
                        sx={{
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                        }}
                    />
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Box className="profile-level-list" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {LEVELS.map((level) => (
                        <Box key={level.level} className="profile-level-row" sx={{ borderBottom: '1px solid #ccc', pb: 1 }}>
                            <Typography fontWeight="bold">Level {level.level}: {level.name}</Typography>
                            <Typography variant="body2">{level.description}</Typography>
                            <Typography variant="body2">
                                <strong>Requirements:</strong>
                                {` ${level.requirements.games} games, ${level.requirements.achievements} achievements, ${level.requirements.friends} friends`}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}
