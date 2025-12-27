import React, { useState, useRef, useEffect } from 'react';
import './ChatbotOverlay.scss';
import { chatbotApi, type ChatResponse } from '../../services/chatbotApi.ts';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    sources?: string[];
    confidence?: number;
}

interface ChatbotOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatbotOverlay({ isOpen, onClose }: ChatbotOverlayProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your game rules assistant. Ask me anything about chess or  tic-tac-toe',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        const messageText = inputValue;
        setInputValue('');
        setIsTyping(true);
        setError(null);

        try {
            // Call the chatbot API
            const response: ChatResponse = await chatbotApi.sendMessage(messageText);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.content,
                sender: 'bot',
                timestamp: new Date(),
                sources: response.sources,
                confidence: response.confidence,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setError('Failed to get response from chatbot. Please make sure the server is running.');
            console.error('Error calling chatbot API:', err);

            // Add error message to chat
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: ' Sorry, I encountered an error. Please try again by rephrasing or make sure the chatbot server is running.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = async () => {
        try {
            await chatbotApi.resetConversation();
            setMessages([
                {
                    id: '1',
                    text: '👋 Conversation reset! Ask me anything about game rules.',
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
            setError(null);
        } catch (err) {
            setError('Failed to reset conversation.');
            console.error('Error resetting conversation:', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // const getConfidenceColor = (confidence?: number): string => {
    //     if (!confidence) return '';
    //     if (confidence > 0.6) return 'high-confidence';
    //     if (confidence > 0.3) return 'medium-confidence';
    //     return 'low-confidence';
    // };
    //
    // const formatConfidence = (confidence?: number): string => {
    //     if (!confidence) return '';
    //     return `${Math.round(confidence * 100)}% confident`;
    // };

    if (!isOpen) return null;

    return (
        <div className="overlay">
            <div className="overlay-backdrop" onClick={onClose} />
            <div className="overlay-container">
                <div className="overlay-header">
                    <div className="header-content">
                        <h3 className="chatbot-title"> Game Rules Assistant</h3>
                        <div className="header-actions">
                            <button
                                className="btn-reset"
                                onClick={handleReset}
                                aria-label="Reset conversation"
                                title="Reset conversation"
                            >
                                🔄
                            </button>
                            <button
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close chat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                         {error}
                    </div>
                )}

                <div className="chatbot-messages" ref={chatMessagesRef}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        >
                            <div className="message-bubble">
                                {message.text}

                                {/*/!* Show confidence and sources for bot messages *!/*/}
                                {/*{message.sender === 'bot' && message.confidence !== undefined && (*/}
                                {/*    <div className="message-meta">*/}
                                {/*        <span className={`confidence-badge ${getConfidenceColor(message.confidence)}`}>*/}
                                {/*            {formatConfidence(message.confidence)}*/}
                                {/*        </span>*/}
                                {/*    </div>*/}
                                {/*)}*/}

                                {/*{message.sender === 'bot' && message.sources && message.sources.length > 0 && (*/}
                                {/*    <div className="message-sources">*/}
                                {/*        <small> {message.sources.join(', ')}</small>*/}
                                {/*    </div>*/}
                                {/*)}*/}
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
                        placeholder="Ask about game rules..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="chat-input"
                        disabled={isTyping}
                    />
                    <button
                        className="btn-send"
                        onClick={handleSendMessage}
                        disabled={isTyping || inputValue.trim() === ''}
                        aria-label="Send message"
                    >

                    </button>
                </div>
            </div>
        </div>
    );
}