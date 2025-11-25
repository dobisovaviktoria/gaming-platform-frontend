// Example: Add to any page
import React, { useState } from 'react';
import ChatbotOverlay from '../components/ChatbotOverlay';
import './TestPage.scss';

const TestPage: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div>
            {/* Your page content */}

    {/* Floating chat button */}
    <button
        className="floating-chat-btn"
    onClick={() => setIsChatOpen(true)}
    aria-label="Open chat"
        >
        💬
      </button>

      <ChatbotOverlay
    isOpen={isChatOpen}
    onClose={() => setIsChatOpen(false)}
    />
    </div>
);
};

export default TestPage;