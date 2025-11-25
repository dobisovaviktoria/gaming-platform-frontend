import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameModeOverlay from '../../components/overlays/GameModeOverlay.tsx';
import Navbar from "../../components/Navbar.tsx";
import SideMenu from "../../components/overlays/SideMenu.tsx";

const GameDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [showModeOverlay, setShowModeOverlay] = useState(false);

    const handleStatsClick = () => {
        navigate(`/game/${id}/statistics`);
    };

    const handleAchievementsClick = () => {
        navigate(`/game/${id}/achievements`);
    };

    const handlePlayClick = () => {
        setShowModeOverlay(true);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        document.body.classList.remove('menu-open');
    };

    return (
        <div>
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
            <h1>Game: {id}</h1>

            <button onClick={handleStatsClick}>Stats</button>
            <button onClick={handleAchievementsClick}>Achievements</button>
            <button onClick={handlePlayClick}>Play</button>

            <GameModeOverlay
                isOpen={showModeOverlay}
                gameId={id || ''}
                onClose={() => setShowModeOverlay(false)}
            />
        </div>
    );
};

export default GameDetailsPage;
