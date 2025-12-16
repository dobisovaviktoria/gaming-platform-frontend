import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGame } from '../services/game';
import type { Game } from '../model/types';
import './GameDetailsPage.scss';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {useState} from "react";
import GameModeOverlay from "../components/overlays/GameModeOverlay.tsx";
import Navbar from "../components/Navbar.tsx";
import SideMenu from "../components/overlays/SideMenu.tsx";
import GameLobbyOverlay from "../components/overlays/GameLobbyOverlay.tsx";
import GameEndOverlay from "../components/overlays/GameEndOverlay.tsx";

const gameResult = "win";
interface GameDetailsPageProps {
    isEnd?: boolean;
}

export default function GameDetails({ isEnd = false }: GameDetailsPageProps) {
    const [showModeOverlay, setShowModeOverlay] = useState(false);
    const [showLobbyOverlay, setShowLobbyOverlay] = useState<boolean>(false);
    const [showEndOverlay, setShowEndOverlay] = useState(isEnd);
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    const { data: game, isLoading } = useQuery<Game, Error>({
        queryKey: [gameId || ''],
        queryFn: () => getGame(gameId || '')
    });
    console.log(game);
    const handleStatsClick = () => {
        navigate(`/game/${gameId}/statistics`);
    };

    const handleAchievementsClick = () => {
        navigate(`/game/${gameId}/achievements`);
    };

    const handlePlayClick = () => {
        console.log(`Playing game: ${game?.name}, URL: ${game?.url}`);
        if (game?.name === 'Chess' && game?.url) {
            window.location.href = game.url;
        } else {
            setShowModeOverlay(true);
        }
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

    if (isLoading) {
        return <div className="page">Loading...</div>;
    }

    if (!game) {
        return (
            <div className="page">
                <h2>Game not found</h2>
                <button onClick={() => navigate('/')}>Back to Dashboard</button>
            </div>
        );
    }

    // Mock data for now
    const leaderboard = [
        { rank: 1, user: 'PlayerOne', score: 2500 },
        { rank: 2, user: 'PlayerTwo', score: 2350 },
        { rank: 3, user: 'PlayerThree', score: 2100 },
        { rank: 4, user: 'PlayerFour', score: 1900 },
    ];

    return (
        <div className="page">
            <Navbar onMenuToggle={handleMenuToggle} />
            <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
            <header>
                <h1>{game.name}</h1>
                <StarBorderIcon className="star-icon" />
            </header>

            <div className="top-section">
                <div className="game-image">
                    <img src={game.pictureUrl}  alt={game.name}/>
                </div>
                <div className="buttons">
                    <button onClick={handleAchievementsClick}>Achievements</button>
                    <button onClick={handleStatsClick}>Stats</button>
                </div>
            </div>

            <div className="overview-section">
                <h2>Overview</h2>
                <p>
                    {game.description}.<br/>
                    Max players: {game.maxPlayers}.
                </p>
            </div>

            <div className="leaderboard-section">
                <h2>Leaderboard <EmojiEventsIcon /></h2>
                <ul className="leaderboard-list">
                    {leaderboard.map((entry) => (
                        <li key={entry.rank}>
                            <span><span className="rank">#{entry.rank}</span> {entry.user}</span>
                            <span>{entry.score}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="footer-actions">
                <button className="play-button" onClick={handlePlayClick}>
                    Play <PlayArrowIcon />
                </button>
            </div>
            <GameModeOverlay
                isOpen={showModeOverlay}
                url={game.url || ''}
                showLobby={() => setShowLobbyOverlay(true)}
                onClose={() => setShowModeOverlay(false)}
            />
            <GameLobbyOverlay
                isOpen={showLobbyOverlay}
                gameName={game.name}
                gameId={game.id}
                maxPlayers={game.maxPlayers}
                onClose={() => setShowLobbyOverlay(false)}
            />
            <GameEndOverlay
                isOpen={showEndOverlay}
                result={gameResult}
                gameId={gameId ? gameId : ""}
                onPlayAgain={handlePlayClick}
                onClose={() => {
                    navigate(`/game/${gameId}`);
                    setShowEndOverlay(false);
                }}
            />
        </div>
    );
}