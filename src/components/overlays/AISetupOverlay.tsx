import {useState} from 'react';
import './AISetupOverlay.scss';
import type {DataGenerationConfig} from "../../model/types.ts";

interface AISetupOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    mutate: (config: DataGenerationConfig) => void;
}

const games = ['Tic Tac Toe'];

export default function AISetupOverlay({isOpen, onClose, mutate}: AISetupOverlayProps) {
    const [selectedGame, setSelectedGame] = useState('Tic Tac Toe');
    const [numberOfGames, setNumberOfGames] = useState(100);

    const handleStart = () => {
        const config: DataGenerationConfig = {
            game: selectedGame,
            plays: numberOfGames
        };

        mutate(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="overlay ai-setup-overlay">
            <div className="overlay-backdrop" onClick={onClose}/>
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="title">AI vs AI</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="overlay-content">
                    <div className="form-content">
                        {/* Game Selection */}
                        <div className="form-group">
                            <label className="form-label">Game</label>
                            <div className="select-wrapper">
                                <select
                                    value={selectedGame}
                                    onChange={(e) => setSelectedGame(e.target.value)}
                                    className="form-select"
                                >
                                    {games.map((game) => (
                                        <option key={game} value={game}>
                                            {game}
                                        </option>
                                    ))}
                                </select>
                                <span className="select-icon">▼</span>
                            </div>
                        </div>

                        {/* Number of Simulations */}
                        <div className="form-group">
                            <label className="form-label">Runs</label>
                            <input
                                type="number"
                                value={numberOfGames}
                                onChange={(e) => setNumberOfGames(Number(e.target.value))}
                                className="form-input"
                                min="1"
                            />
                        </div>

                        {/* Start Button */}
                        <button className="btn-start" onClick={handleStart}>
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
