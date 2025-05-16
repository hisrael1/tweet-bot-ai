import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSelection from './components/pages/UserSelection';
import ChatInterface from './components/pages/ChatInterface';
import LandingPage from './components/pages/LandingPage';

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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/select" 
          element={
            <UserSelection 
              onUserSelect={handleUserSelect} 
              isLoading={isLoading} 
            />
          } 
        />
        <Route 
          path="/chat" 
          element={
            selectedUser ? (
              <ChatInterface selectedUser={selectedUser} />
            ) : (
              <UserSelection 
                onUserSelect={handleUserSelect} 
                isLoading={isLoading} 
              />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
