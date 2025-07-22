import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Chatbot.module.css';

function Chatbot({ onSendMessage, messages }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === 'user' ? styles.userMsg : styles.botMsg}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi về thời tiết..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendBtn}>Gửi</button>
      </div>
    </div>
  );
}

export default Chatbot; 