import React, { useState, useRef, useEffect } from 'react';
import './ChatbotOverlay.scss';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatbotOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatbotOverlay({ isOpen, onClose } : ChatbotOverlayProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate API call with delay
        setTimeout(() => {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/chatbot', {
            //   method: 'POST',
            //   body: JSON.stringify({ message: inputValue })
            // });
            // const data = await response.json();

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'This is a default response. I will be connected to an API soon!',
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="chatbot-title">😊 Your AI Companion</h3>
                        <button className="btn-close" onClick={onClose} aria-label="Close chat">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="chatbot-messages" ref={chatMessagesRef}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        >
                            <div className="message-bubble">
                                {message.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message bot-message">
                            <div className="message-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-input-container">
                    <input
                        type="text"
                        placeholder="Input field"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="chat-input"
                    />
                    <button
                        className="btn-send"
                        onClick={handleSendMessage}
                        aria-label="Send message"
                    >
                        ✈️
                    </button>
                </div>
            </div>
        </div>
    );
};