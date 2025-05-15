interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
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
  );
}; 