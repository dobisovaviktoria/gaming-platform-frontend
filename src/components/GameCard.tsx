import {Card, CardContent, CardActions, Typography, Button, Box, Avatar} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type {Game} from '../model/types';
import {useNavigate} from 'react-router-dom';
import React from "react";

interface GameCardProps {
    game: Game;
    isFavorite?: boolean;
    onToggleFavorite?: (gameId: string, isFavorite: boolean) => void;
}

export default function GameCard({game, isFavorite = false, onToggleFavorite}: GameCardProps) {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate(`/game/${game.id}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(game.id, isFavorite);
        }
    };

    return (
        <Card>
            <Box position="relative">
                <Box position="absolute" top={8} right={8} zIndex={1}>
                    <Button onClick={handleFavoriteClick} size="small" variant="text">
                        {isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
                    </Button>
                </Box>
                <Box height={200} bgcolor="action.hover" display="flex" alignItems="center" justifyContent="center">
                    <Avatar
                        src={game.pictureUrl}
                        alt={game.name}
                        variant="rounded"
                        sx={{width: '100%', height: '100%'}}
                    >
                        <Typography variant="h4">{game.name.charAt(0)}</Typography>
                    </Avatar>
                </Box>
            </Box>
            <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                    {game.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    {game.maxPlayers} players
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" fullWidth onClick={handlePlayClick}>
                    Play
                </Button>
            </CardActions>
        </Card>
    );
}