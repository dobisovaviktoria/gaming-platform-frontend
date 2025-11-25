import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import './AddGamePage.scss';
import { Link } from "react-router";

const AddGamePage: React.FC = () => {
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
        <div className="add-game-page">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />

            <div className="add-game-content">
                <h1>How to Add a Game?</h1>

                <div className="documentation-text">
                    <p>
                        To add a new game to the platform, you need to follow these steps and ensure
                        your game meets our requirements.
                    </p>
                    <p>
                        First, make sure your game is compatible with our platform. Games should be
                        web-based and follow our API guidelines for player management and game state.
                    </p>
                    <p>
                        You'll need to provide the following information: game name, description,
                        number of players, game category, and thumbnail image.
                    </p>
                    <p>
                        The game should implement our authentication system and handle player sessions
                        properly. Review our developer documentation for detailed integration steps.
                    </p>
                    <p>
                        Once your game is ready, click the button below to submit it for review. Our
                        team will test your game and approve it within 3-5 business days.
                    </p>
                </div>

                <Link className="btn-add-game" to="/add-game/new">
                    Add a Game
                </Link>
            </div>
        </div>
    );
};

export default AddGamePage;
