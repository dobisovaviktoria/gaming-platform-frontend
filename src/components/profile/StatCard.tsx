import {Card, CardContent, Box, Typography} from '@mui/material';
import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    sublabel?: string;
}

export default function StatCard({ icon, label, value, sublabel }: StatCardProps) {
    return (
        <Card className="profile-stat-card">
            <CardContent>
                <Box className="profile-stat-content">
                    {icon}
                    <Typography variant="body2" className="profile-stat-label">
                        {label}
                    </Typography>
                    <Typography variant="h5" className="profile-stat-value">
                        {value}
                    </Typography>
                    {sublabel && (
                        <Typography variant="caption" className="profile-stat-sublabel">
                            {sublabel}
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}