import { User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import SourceLinks from './SourceLinks';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'ai'}`}>
      <div className={`avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? <User size={20} /> : 'TA'}
      </div>
      
      <div className="message-content">
        <div className="message-text">{message.text}</div>
        
        {message.imageBase64 && (
          <img 
            src={message.imageBase64} 
            alt="Uploaded content" 
            className="message-image" 
          />
        )}
        
        {!isUser && message.links && message.links.length > 0 && (
          <SourceLinks links={message.links} />
        )}
        
        {!isUser && (
          <div className="message-actions">
            <button className="icon-btn" onClick={handleCopy} title="Copy answer">
              {copied ? <Check size={16} style={{color: '#10b981'}} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
