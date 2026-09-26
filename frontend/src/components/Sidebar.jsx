import { MessageSquarePlus, MessageSquare, Moon, Sun, Info, Trash2 } from 'lucide-react';

const Sidebar = ({ history, onNewChat, onLoadChat, onClearHistory, onShowAbout, theme, toggleTheme, isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <MessageSquarePlus size={18} />
            New Chat
          </button>
        </div>
        
        <div className="history-list">
          {history.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No recent chats
            </div>
          ) : (
            history.map((chat) => (
              <button 
                key={chat.id} 
                className="history-item"
                onClick={() => onLoadChat(chat.id)}
              >
                <MessageSquare size={16} />
                <span className="history-item-text">{chat.title}</span>
              </button>
            ))
          )}
        </div>
        
        <div className="sidebar-footer">
          {history.length > 0 && (
            <button className="theme-toggle-btn" onClick={onClearHistory} style={{ color: 'var(--accent-color)' }}>
              <Trash2 size={18} />
              Clear History
            </button>
          )}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button className="theme-toggle-btn" onClick={onShowAbout}>
            <Info size={18} />
            About Virtual TA
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
