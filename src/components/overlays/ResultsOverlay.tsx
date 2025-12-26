import './ResultsOverlay.scss';
import type {DataGenerationResponse} from "../../model/types.ts";

interface ResultsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    results: DataGenerationResponse;
    onDelete: (file: string) => void;
    onSave: () => void;
}

export default function ResultsOverlay({
                                           isOpen,
                                           onClose,
                                           results,
                                           onDelete,
                                           onSave
                                       }: ResultsOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="overlay results-overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="title">Generated Data</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="overlay-content">
                    <div className="results-content">
                        <h2 className="results-title">Run Complete</h2>

                        <div className="results-stats">
                            <div className="stat-item">
                                <span className="stat-label">P1 win:</span>
                                <span className="stat-value">{results.wins}</span>
                            </div>

                            <div className="stat-item">
                                <span className="stat-label">Draws:</span>
                                <span className="stat-value">{results.draws}</span>
                            </div>

                            <div className="stat-item">
                                <span className="stat-label">P2 win:</span>
                                <span className="stat-value">{results.losses}</span>
                            </div>

                            <div className="stat-item file-item">
                                <span className="stat-label">File:</span>
                                <span className="stat-value filename">{results.file}</span>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-delete" onClick={() => onDelete(results.file)}>
                                Delete
                            </button>
                            <button className="btn-save" onClick={onSave}>
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
