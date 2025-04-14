// apps/web/src/components/Message.tsx
interface MessageProps {
  content: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export default function Message({ content, timestamp, isOwnMessage }: MessageProps) {
  return (
    <div className={`message-container ${isOwnMessage ? 'own' : ''}`}>
      <div className={`message-bubble ${isOwnMessage ? 'own' : 'other'}`}>
        <div>{content}</div>
        <div className="message-time">{timestamp}</div>
      </div>
    </div>
  );
}