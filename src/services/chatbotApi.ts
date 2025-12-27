const API_BASE_URL = 'http://localhost:5000/api/chatbot';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    content: string;
    sources: string[];
    confidence: number;
}

export interface ConversationHistory {
    messages: ChatMessage[];
}

class ChatbotApiService {

    async sendMessage(message: string): Promise<ChatResponse> {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async getHistory(): Promise<ConversationHistory> {
        const response = await fetch(`${API_BASE_URL}/history`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }


    async resetConversation(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}

export const chatbotApi = new ChatbotApiService();