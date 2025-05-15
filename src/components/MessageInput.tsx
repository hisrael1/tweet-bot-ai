interface MessageInputProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const MessageInput = ({ inputMessage, onInputChange, onSendMessage, isLoading }: MessageInputProps) => {
  return (
    <form onSubmit={onSendMessage} className="bg-white p-4 shadow-md">
      <div className="flex space-x-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}; 