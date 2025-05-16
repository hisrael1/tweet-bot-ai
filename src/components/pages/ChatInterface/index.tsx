import { useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message } from "../../../../shared/types";
import { Link } from "react-router-dom";

interface ChatInterfaceProps {
  selectedUser: User;
}

export interface User {
  username: string;
  avatar: string;
}

const ChatInterface = ({ selectedUser }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi! I'm @${selectedUser.username}. How can I help you today?`,
      isBot: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages((prev) => [...prev, newMessage].slice(-10));
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputMessage,
          user: selectedUser.username,
          pastMessages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const botResponse = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: error instanceof Error && error.message.includes("No tweets found") 
          ? "Sorry, I couldn't find any tweets for this user. Please try another personality."
          : "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <Link to="/">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              PersonaFi
            </h1>
          </div>
        </Link>

        <div className="flex-1 p-4">
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-gray-50 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 flex items-center justify-center text-white font-semibold">
                {selectedUser.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  @{selectedUser.username}
                </p>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
          </div>
        </div>

        <Link to="/select">
          <div className="p-4 border-t border-gray-200">
            <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white font-medium hover:from-teal-700 hover:to-teal-600 transition-all duration-200">
              Switch Personality
            </button>
          </div>
        </Link>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 flex items-center justify-center text-white font-semibold">
              {selectedUser.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                @{selectedUser.username}
              </h2>
              <p className="text-sm text-gray-500">AI-powered conversation</p>
            </div>
          </div>
        </div>

        <MessageList messages={messages} isLoading={isLoading} />

        <MessageInput
          inputMessage={inputMessage}
          onInputChange={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
