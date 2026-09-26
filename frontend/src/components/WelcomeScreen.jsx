import { BookOpen } from 'lucide-react';

const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    "What is the difference between supervised and unsupervised learning?",
    "Explain how backpropagation works.",
    "Can you help me understand linear regression?",
    "What are the prerequisites for this course?"
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-icon">
        <BookOpen size={32} />
      </div>
      <h2>Virtual Teaching Assistant</h2>
      <p>Hello! I'm your AI TA for the Data Science course. Ask me anything about the lectures, concepts, or assignments.</p>
      
      <div className="suggestions">
        {suggestions.map((text, idx) => (
          <button 
            key={idx} 
            className="suggestion-btn"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
