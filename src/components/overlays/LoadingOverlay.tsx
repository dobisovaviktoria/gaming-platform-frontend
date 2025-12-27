import './LoadingOverlay.scss';

interface LoadingOverlayProps {
    isOpen: boolean;
    message?: string;
}

export default function LoadingOverlay({ isOpen, message }: LoadingOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="overlay loading-overlay">
            <div className="overlay-backdrop" />
            <div className="overlay-container">
                <div className="loading-content">
                    <div className="spinner" />
                    {message && <p className="loading-message">{message}</p>}
                </div>
            </div>
        </div>
    );
}
