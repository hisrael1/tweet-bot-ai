import { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface User {
  username: string;
  avatar: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

interface ChatInterfaceProps {
  selectedUser: User;
}

export const ChatInterface = ({ selectedUser }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm @${selectedUser.username}. How can I help you today?`,
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: `This is a simulated response from @${selectedUser.username}. In a real implementation, this would be an AI-generated response based on the user's tweets.`,
        isBot: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
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
      />
    </div>
  );
}; 