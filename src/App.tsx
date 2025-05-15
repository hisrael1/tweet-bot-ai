import { useState, useEffect } from 'react';
import './App.css';

interface User {
  username: string;
  avatar: string;
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/allUsernames');
        const data = await response.json();
        // Transform the data to match our User interface
        const transformedUsers = data.usernames.map((user: { username: string }) => ({
          username: user.username,
          avatar: `https://i.pravatar.cc/150?u=${user.username}` // Generate avatar based on username
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };
    fetchUsernames();
  }, []);

  const handleCreateBot = () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
      setShowChat(true);
      // Add initial greeting message
      setMessages([
        {
          id: 1,
          text: `Hi! I'm @${selectedUser.username}'s AI persona. How can I help you today?`,
          isBot: true,
        },
      ]);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser) return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: `This is a simulated response from @${selectedUser.username}'s AI persona. In a real implementation, this would be generated based on the user's personality and knowledge.`,
        isBot: true,
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  if (showChat && selectedUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white shadow-md p-4 flex items-center">
          <button
            onClick={() => setShowChat(false)}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <img
            src={selectedUser.avatar}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full mr-3"
          />
          <h1 className="text-xl font-semibold">@{selectedUser.username}'s AI</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isBot
                    ? 'bg-white shadow-md'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="bg-white p-4 shadow-md">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">PersonaFi</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Persona
            </label>
            <select
              value={selectedUser?.username || ''}
              onChange={(e) => {
                const user = users.find(u => u.username === e.target.value);
                setSelectedUser(user || null);
              }}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a persona...</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  @{user.username}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateBot}
            disabled={!selectedUser || isLoading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
              !selectedUser || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Bot...
              </div>
            ) : (
              'Create Chat Bot'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
