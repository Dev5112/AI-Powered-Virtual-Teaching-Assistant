import { useState } from 'react';
import { ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';

const SourceLinks = ({ links }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!links || links.length === 0) return null;

  return (
    <div className="sources-container">
      <button 
        className="sources-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {links.length} Source{links.length !== 1 ? 's' : ''}
      </button>
      
      {isOpen && (
        <div className="sources-list">
          {links.map((link, idx) => (
            <div key={idx} className="source-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <LinkIcon size={14} />
                Source {idx + 1}
              </a>
              <div className="source-text">{link.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceLinks;
