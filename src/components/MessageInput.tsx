interface MessageInputProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const MessageInput = ({ inputMessage, onInputChange, onSendMessage }: MessageInputProps) => {
  return (
    <form onSubmit={onSendMessage} className="bg-white p-4 shadow-md">
      <div className="flex space-x-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
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
  );
}; 