// App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // API call to your Python backend
      const response = await axios.post('http://localhost:8000/chat', {
        user_message: inputMessage
      });

      // Add bot response
      setMessages(prev => [...prev, { 
        text: response.data.bot_response, 
        isBot: true 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "Wubba lubba dub dub! Server error!", 
        isBot: true 
      }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Rick & Morty Chatbot</h1>
          <div className="typing-indicator">
            {isTyping && "Rick is typing..."}
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
              <div className="message-content">
                {msg.text.split('<|endoftext|>').map((part, i) => (
                  <p key={i}>{part}</p>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Say something to Rick..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
