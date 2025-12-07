import './GameModeOverlay.scss';

interface GameModeOverlayProps {
    isOpen: boolean;
    url: string;
    showLobby: () => void;
    onClose: () => void;
}

export default function GameModeOverlay({ isOpen, showLobby, url, onClose }: GameModeOverlayProps) {

    const handleAgainstAI = () => {
        console.log('Starting game against AI...');
        window.location.href = url;
        onClose();
    };

    const handleHumanGame = () => {
        console.log('Starting human game...');
        showLobby();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="title">Mode</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="overlay-content">
                    <div className="buttons">
                        <button className="btn" onClick={handleAgainstAI}>
                            <span className="btn-icon">🤖</span>
                            <span className="btn-label">Against AI</span>
                        </button>

                        <button className="btn" onClick={handleHumanGame}>
                            <span className="btn-icon">👤</span>
                            <span className="btn-label">Against another person</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};