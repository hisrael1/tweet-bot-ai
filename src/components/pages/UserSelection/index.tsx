import { useState, useEffect } from 'react';
import SearchDropdown from './SearchDropdown';
import Footer from '../../shared/Footer';
import NavBar from '../../shared/NavBar';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  avatar: string;
}

interface UserSelectionProps {
  onUserSelect: (user: User) => void;
  isLoading: boolean;
}

const UserSelection = ({ onUserSelect, isLoading }: UserSelectionProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/allUsernames');
        // const response = await fetch('https://tweet-bot-ai-production.up.railway.app/api/allUsernames');
        const data = await response.json();
        const transformedUsers = data.usernames.map((user: { username: string }) => ({
          username: user.username,
          avatar: `https://i.pravatar.cc/150?u=${user.username}`
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching usernames:', error);
      }
    };
    fetchUsernames();
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    onUserSelect(user);
    setTimeout(() => {
      navigate('/chat');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-lime-50 flex flex-col">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Twitter Personality
            </h2>
            <p className="text-gray-600">
              Select a personality to start an AI-powered conversation
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Personalities
              </label>
              <SearchDropdown
                users={users}
                onSelect={handleUserSelect}
                placeholder="Type to search Twitter personalities..."
              />
            </div>

            <div className="pt-4">
              <button
                onClick={() => selectedUser && onUserSelect(selectedUser)}
                disabled={!selectedUser || isLoading}
                className={`w-full py-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  !selectedUser || isLoading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating AI Persona...
                  </div>
                ) : (
                  'Start Conversation'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>Powered by the Community Archive</p>
              <p className="mt-1">Select a personality to begin your conversation</p>
            </div>
          </div>
        </div>
      </div>

      <Footer /> 
    </div>
  );
}; 

export default UserSelection;