import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

const ChatInput = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((text.trim() || image) && !isLoading) {
      onSend(text.trim(), image);
      setText('');
      setImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="input-container">
      {image && (
        <div className="image-preview-container">
          <div className="image-preview-item">
            <img src={image} alt="Preview" />
            <button 
              className="remove-image-btn"
              onClick={() => setImage(null)}
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      <form className="input-row" onSubmit={handleSubmit}>
        <input 
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="file-input"
        />
        <button 
          type="button" 
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          title="Upload Image"
        >
          <ImageIcon size={20} />
        </button>
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="chat-input"
          disabled={isLoading}
          rows={1}
        />
        
        <button 
          type="submit" 
          className="send-btn"
          disabled={(!text.trim() && !image) || isLoading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
