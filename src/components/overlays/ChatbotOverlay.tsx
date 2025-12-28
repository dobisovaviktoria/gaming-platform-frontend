import React, {useState, useRef, useEffect} from 'react';
import {Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, TextField, Stack, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import {chatbotApi, type ChatResponse} from '../../services/chatbotApi.ts';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatbotOverlay({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your game rules assistant. Ask me anything about games or the platform',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const text = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const response: ChatResponse = await chatbotApi.sendMessage(text);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.content,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Sorry, I encountered an error. Please try again.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleReset = async () => {
        await chatbotApi.resetConversation();
        setMessages([
            {
                id: '1',
                text: 'Conversation reset! Ask me anything about game rules or the game platform.',
                sender: 'bot',
                timestamp: new Date(),
            },
        ]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="chat-title">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Game Rules Assistant</Typography>
                    <Box>
                        <IconButton onClick={handleReset}>
                            <RefreshIcon />
                        </IconButton>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={2} className="chat-messages" maxHeight="60vh" overflow="auto">
                    {messages.map((msg) => (
                        <Box
                            key={msg.id}
                            className={msg.sender === 'user' ? 'chat-message-user' : 'chat-message-bot'}
                        >
                            <Typography variant="body1" whiteSpace="pre-wrap">
                                {msg.text}
                            </Typography>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box alignSelf="flex-start">
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Stack>
            </DialogContent>

            <Box className="chat-input-container">
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        fullWidth
                        placeholder="Ask about game rules..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                        className="chat-input"
                        variant="outlined"
                    />
                    <IconButton
                        className="chat-send-button"
                        onClick={handleSendMessage}
                        disabled={isTyping || !inputValue.trim()}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
}