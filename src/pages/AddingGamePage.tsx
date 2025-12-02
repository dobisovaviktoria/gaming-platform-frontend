import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './AddingGamePage.scss';
import {useAddGame} from "../hooks/useGame.ts";
import type {Game} from "../model/types.ts";

interface GameFormData {
    url: string;
    name: string;
    pictureUrl: string;
    description: string;
    rules: string;
    maxPlayers: number;
}

const AddingGamePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<GameFormData>({
        name: '',
        url: '',
        pictureUrl: '',
        description: '',
        rules: '',
        maxPlayers: 2,
    });

    const onSuccess = (game : Game) => navigate('/game/' + game.id);

    const {addNewGame} = useAddGame(onSuccess)

    const handleBackClick = () => {
        navigate('/add-game');
    };

    const handleInputChange = (field: keyof GameFormData, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting game:', formData);

        addNewGame(formData);

        navigate('/add-game');
    };

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-back" onClick={handleBackClick} aria-label="Go back">
                    ←
                </button>
                <h1>Adding Game</h1>
            </div>

            <form className="game-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="gameName">Game Name</label>
                    <input
                        id="gameName"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Game Name"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gameSource">Game Picture</label>
                    <input
                        id="gameSource"
                        type="text"
                        value={formData.url}
                        onChange={(e) => handleInputChange('url', e.target.value)}
                        placeholder="URL"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gamePicture">Game Picture</label>
                    <input
                        id="gamePicture"
                        type="text"
                        value={formData.pictureUrl}
                        onChange={(e) => handleInputChange('pictureUrl', e.target.value)}
                        placeholder="URL"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gameDescription">Game Description</label>
                    <input
                        id="gameDescription"
                        type="text"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Description"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gameRules">Game Rules</label>
                    <input
                        id="gameRules"
                        type="text"
                        value={formData.rules}
                        onChange={(e) => handleInputChange('rules', e.target.value)}
                        placeholder="Rules"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="maxPlayers">Max Players
                    </label>
                    <input
                        id="maxPlayers"
                        type="number"
                        value={formData.maxPlayers}
                        onChange={(e) => handleInputChange('maxPlayers', e.target.value)}
                        placeholder="2"
                        required
                    />
                </div>

                <button type="submit" className="btn-submit">
                    Add Game
                </button>
            </form>
        </div>
    );
};

export default AddingGamePage;
