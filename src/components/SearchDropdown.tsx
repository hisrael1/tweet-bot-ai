import { useState, useRef, useEffect } from 'react';

interface User {
  username: string;
  avatar: string;
}

interface SearchDropdownProps {
  users: User[];
  onSelect: (user: User) => void;
  placeholder?: string;
}

export const SearchDropdown = ({ users, onSelect, placeholder = "Search for someone..." }: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(user.username);
    setIsOpen(false);
    onSelect(user);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-4 pl-12 text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && filteredUsers.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.username}
              onClick={() => handleSelect(user)}
              className="group flex items-center px-4 py-3.5 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-150">
                  @{user.username}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredUsers.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">No matches found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
}; 