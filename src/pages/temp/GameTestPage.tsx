// In your game component
import React, { useState } from 'react';
import GameEndOverlay from '../../components/overlays/GameEndOverlay.tsx';

const GamePage: React.FC = () => {
    const [showEndOverlay, setShowEndOverlay] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw'>('win');
    const gameId = '1';

    const handleGameEnd = (result: 'win' | 'loss' | 'draw') => {
        setGameResult(result);
        setShowEndOverlay(true);
    };

    const handlePlayAgain = () => {
        console.log('Starting new game...');
        // Reset game state
        setShowEndOverlay(false);
    };

    return (
        <div>
            {/* Your game content */}

            {/* Test buttons - remove in production */}
            <button onClick={() => handleGameEnd('win')}>Test Win</button>
            <button onClick={() => handleGameEnd('loss')}>Test Loss</button>
            <button onClick={() => handleGameEnd('draw')}>Test Draw</button>

            <GameEndOverlay
                isOpen={showEndOverlay}
                result={gameResult}
                gameId={gameId}
                onPlayAgain={handlePlayAgain}
                onClose={() => setShowEndOverlay(false)}
            />
        </div>
    );
};

export default GamePage;