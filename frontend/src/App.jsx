import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const savedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      // Save current chat to history if it has messages
      const newHistoryItem = {
        id: Date.now().toString(),
        title: messages[0].text.substring(0, 30) + '...',
        messages: [...messages]
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    }
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setHistory([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const loadChat = (id) => {
    if (messages.length > 0 && !history.find(c => c.id === 'current')) {
       // Optional: could save current before switching
    }
    const chat = history.find(c => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        history={history} 
        onNewChat={handleNewChat}
        onLoadChat={loadChat}
        onClearHistory={handleClearHistory}
        onShowAbout={() => setShowAboutModal(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <main className="main-area">
        <header className="header">
          <button 
            className="menu-btn"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <h1>Virtual Teaching Assistant</h1>
          <div className="status-indicator">
            <span className="status-dot"></span>
            Ready
          </div>
        </header>
        
        <ChatWindow 
          messages={messages} 
          setMessages={setMessages} 
        />
      </main>

      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-color)', padding: '2rem', borderRadius: '8px', maxWidth: '400px', width: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>About Virtual TA</h2>
            <p>This is a virtual teaching assistant powered by AI. It uses advanced language models to provide accurate, context-aware answers to your queries.</p>
            <p>Features include:</p>
            <ul>
              <li>Contextual Q&A</li>
              <li>Image analysis</li>
              <li>Chat history management</li>
            </ul>
            <button 
              onClick={() => setShowAboutModal(false)}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
