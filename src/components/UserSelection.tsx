import { useState, useEffect } from 'react';
import { SearchDropdown } from './SearchDropdown';

interface User {
  username: string;
  avatar: string;
}

interface UserSelectionProps {
  onUserSelect: (user: User) => void;
  isLoading: boolean;
}

export const UserSelection = ({ onUserSelect, isLoading }: UserSelectionProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/allUsernames');
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            PersonaFi
          </h1>
          <p className="text-gray-600 text-sm">
            Chat with AI personas based on real Twitter personalities
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a Persona
            </label>
            <SearchDropdown
              users={users}
              onSelect={handleUserSelect}
              placeholder="Search for a Twitter personality..."
            />
          </div>

          <button
            onClick={() => selectedUser && onUserSelect(selectedUser)}
            disabled={!selectedUser || isLoading}
            className={`w-full py-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              !selectedUser || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating AI Persona...
              </div>
            ) : (
              'Start Chat'
            )}
          </button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Powered by advanced AI technology</p>
            <p className="mt-1">Select a persona to begin your conversation</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 