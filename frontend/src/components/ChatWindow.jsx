import { useRef, useEffect, useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendQuery } from '../api/assistant';

const ChatWindow = ({ messages, setMessages }) => {
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text, imageBase64) => {
    const newUserMsg = { role: 'user', text, imageBase64 };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const data = await sendQuery(text, imageBase64);
      const newAiMsg = { 
        role: 'ai', 
        text: data.answer, 
        links: data.links || [] 
      };
      setMessages(prev => [...prev, newAiMsg]);
    } catch (error) {
      const errorMsg = { 
        role: 'ai', 
        text: "Sorry, I'm having trouble connecting to the backend right now. Please check if the API server is running and configured correctly." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={(text) => handleSendMessage(text, null)} />
      ) : (
        <div className="message-list">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="avatar ai">TA</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
      
      <div className="input-area">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;
