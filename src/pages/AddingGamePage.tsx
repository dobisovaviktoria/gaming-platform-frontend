import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddingGamePage.scss';

interface GameFormData {
    gameName: string;
    gameSource: string;
    gamePicture: File | null;
    pictureUrl: string;
    genre: string;
    generateThumbnail: boolean;
}

const AddingGamePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<GameFormData>({
        gameName: '',
        gameSource: '',
        gamePicture: null,
        pictureUrl: '',
        genre: '',
        generateThumbnail: false,
    });

    const handleBackClick = () => {
        navigate('/add-game');
    };

    const handleInputChange = (field: keyof GameFormData, value: string | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            gamePicture: file,
            pictureUrl: file ? URL.createObjectURL(file) : '',
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting game:', formData);

        // TODO: Add API call to submit game
        // const formDataToSend = new FormData();
        // formDataToSend.append('gameName', formData.gameName);
        // formDataToSend.append('gameSource', formData.gameSource);
        // if (formData.gamePicture) {
        //   formDataToSend.append('gamePicture', formData.gamePicture);
        // }
        // formDataToSend.append('genre', formData.genre);
        // formDataToSend.append('generateThumbnail', formData.generateThumbnail.toString());

        // After successful submission:
        // navigate('/add-game');
    };

    return (
        <div className="adding-game-page">
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
                        value={formData.gameName}
                        onChange={(e) => handleInputChange('gameName', e.target.value)}
                        placeholder="Game Name"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gameSource">Game Picture</label>
                    <input
                        id="gameSource"
                        type="text"
                        value={formData.gameSource}
                        onChange={(e) => handleInputChange('gameSource', e.target.value)}
                        placeholder="URL or path"
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="gamePicture">Game Tags</label>
                    <input
                        id="gamePicture"
                        type="text"
                        value={formData.pictureUrl}
                        onChange={(e) => handleInputChange('pictureUrl', e.target.value)}
                        placeholder="Tags"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="genre">Game Files</label>
                    <div className="file-upload-area">
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            hidden
                        />
                        <label htmlFor="fileUpload" className="file-upload-label">
                            <span className="upload-icon">📥</span>
                            <span className="upload-text">
                {formData.gamePicture ? formData.gamePicture.name : 'Click to upload'}
              </span>
                        </label>
                    </div>
                </div>

                <div className="form-field checkbox-field">
                    <label htmlFor="generateThumbnail" className="checkbox-label">
                        <input
                            id="generateThumbnail"
                            type="checkbox"
                            checked={formData.generateThumbnail}
                            onChange={(e) => handleInputChange('generateThumbnail', e.target.checked)}
                        />
                        <span>Separate Frontend</span>
                    </label>
                </div>

                <button type="submit" className="btn-submit">
                    Add Game
                </button>
            </form>
        </div>
    );
};

export default AddingGamePage;
