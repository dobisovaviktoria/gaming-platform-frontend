import {useState} from 'react';
import './AISetupOverlay.scss';
import type {DataGenerationConfig} from "../../model/types.ts";

interface AISetupOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    mutate: (config: DataGenerationConfig) => void;
}

const games = ['Tic Tac Toe'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function AISetupOverlay({isOpen, onClose, mutate}: AISetupOverlayProps) {
    const [selectedGame, setSelectedGame] = useState('Tic Tac Toe');
    const [ai1Difficulty, setAI1Difficulty] = useState('Hard');
    const [ai2Difficulty, setAI2Difficulty] = useState('Easy');
    const [numberOfGames, setNumberOfGames] = useState(100);

    const handleStart = () => {
        const config: DataGenerationConfig = {
            game: selectedGame,
            ai1Difficulty,
            ai2Difficulty,
            wins: numberOfGames
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

                        {/* AI 1 Difficulty */}
                        <div className="form-group">
                            <label className="form-label">AI 1</label>
                            <div className="select-wrapper">
                                <select
                                    value={ai1Difficulty}
                                    onChange={(e) => setAI1Difficulty(e.target.value)}
                                    className="form-select"
                                >
                                    {difficulties.map((difficulty) => (
                                        <option key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </option>
                                    ))}
                                </select>
                                <span className="select-icon">▼</span>
                            </div>
                        </div>

                        {/* AI 2 Difficulty */}
                        <div className="form-group">
                            <label className="form-label">AI 2</label>
                            <div className="select-wrapper">
                                <select
                                    value={ai2Difficulty}
                                    onChange={(e) => setAI2Difficulty(e.target.value)}
                                    className="form-select"
                                >
                                    {difficulties.map((difficulty) => (
                                        <option key={difficulty} value={difficulty}>
                                            {difficulty}
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
