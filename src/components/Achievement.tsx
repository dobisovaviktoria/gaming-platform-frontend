import {Box, Paper} from '@mui/material';
import React from "react";

interface AchievementProps {
    icon: React.ReactNode;
    name: string;
    description?: string;
    achieved: boolean;
}

export default function Achievement({icon, name, description, achieved}: AchievementProps) {
    return (
        <Paper elevation={achieved ? 12 : 4} className={`achievement-item ${achieved ? 'unlocked' : 'locked'}`}>
            <Box className="icon-wrapper">
                {icon}
            </Box>
            <Box className="tooltip">
                <Box className="tooltip-content">
                    <Box fontWeight="bold" color="white">{name}</Box>
                    {description && (
                        <Box>
                            {description}
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}