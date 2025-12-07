import './ConfirmationDialog.scss';

interface ConfirmationDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationDialog({ message, onConfirm, onCancel } : ConfirmationDialogProps) {
    return (
        <div className="confirmation-overlay">
            <div className="confirmation-dialog">
                <p>{message}</p>
                <div className="confirmation-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};
