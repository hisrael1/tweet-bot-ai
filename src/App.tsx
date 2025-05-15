import { useState } from 'react';
import { UserSelection } from './components/UserSelection';
import { ChatInterface } from './components/ChatInterface';

interface User {
  username: string;
  avatar: string;
}

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSelect = (user: User) => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setSelectedUser(user);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {selectedUser ? (
        <ChatInterface selectedUser={selectedUser} />
      ) : (
        <UserSelection onUserSelect={handleUserSelect} isLoading={isLoading} />
      )}
    </div>
  );
}

export default App;
