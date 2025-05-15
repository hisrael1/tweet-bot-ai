import { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '../../shared/types';

interface ChatInterfaceProps {
  selectedUser: User;
}

export interface User {
  username: string;
  avatar: string;
}

export const ChatInterface = ({ selectedUser }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm @${selectedUser.username}. How can I help you today?`,
      isBot: true,
    },
  ]);
  console.log('messages', messages);
  const [inputMessage, setInputMessage] = useState('');
  console.log('inputMessage', inputMessage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages((prev) => [...prev, newMessage].slice(-10));
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputMessage,
          user: selectedUser.username,
          pastMessages: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const botResponse = await response.json();
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white p-4 shadow-md">
        <h2 className="text-xl font-semibold">Chat with @{selectedUser.username}</h2>
      </div>
      <MessageList messages={messages} />
      <MessageInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}; 