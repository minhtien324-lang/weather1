import React, { useState, useRef, useEffect } from 'react';
import { geminiApiService, geminiUtils } from '../api/geminiApi';
import styles from '../styles/Chatbot.module.css';

function Chatbot({ onSendMessage, messages, currentWeather = null, isOpen = false, onToggle, isLoading = false }) {
  const [input, setInput] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiStatus, setAiStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  // Kiểm tra trạng thái AI khi component mount
  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        const status = await geminiApiService.checkStatus();
        setAiStatus(status.status);
        setAiEnabled(status.status === 'connected');
      } catch (error) {
        console.error('AI status check failed:', error);
        setAiStatus('disconnected');
        setAiEnabled(false);
      }
    };
    
    checkAiStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const validation = geminiUtils.validateMessage(input);
    if (!validation.valid) {
      console.warn('Message validation failed:', validation.error);
      return;
    }

    const trimmedInput = validation.message;
    
    // Chỉ gửi tin nhắn người dùng, để HomePage xử lý phản hồi
    onSendMessage(trimmedInput);
    setInput('');
  };



  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChatbot = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <>
      {/* Nút toggle chatbot */}
      <button 
        className={`${styles.toggleButton} ${isOpen ? styles.active : ''}`}
        onClick={toggleChatbot}
        title={isOpen ? 'Đóng chatbot' : 'Mở chatbot'}
      >
        {isOpen ? '✕' : '🤖'}
        {/* Badge hiển thị số tin nhắn mới (nếu có) */}
        {!isOpen && messages.length > 1 && (
          <span className={styles.messageBadge}>
            {messages.length - 1}
          </span>
        )}
      </button>

      {/* Chatbot container */}
      {isOpen && (
        <div className={styles.chatbotContainer}>
          {/* Header với nút đóng */}
          <div className={styles.chatbotHeader}>
            <div className={styles.aiStatus}>
              <div className={`${styles.statusDot} ${styles[aiStatus]}`}></div>
              <span className={styles.statusText}>
                {aiStatus === 'connected' ? '🤖 AI Sẵn sàng' : 
                 aiStatus === 'checking' ? '⏳ Đang kiểm tra...' : 
                 '❌ AI Tạm ngưng'}
              </span>
            </div>
            <button 
              className={styles.closeButton}
              onClick={toggleChatbot}
              title="Đóng chatbot"
            >
              ✕
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${msg.sender === 'user' ? styles.userMsg : styles.botMsg} ${
                  msg.sender === 'ai' ? styles.aiMsg : ''
                }`}
              >
                {msg.sender === 'ai' && <span className={styles.aiIcon}>🤖</span>}
                {msg.text}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className={`${styles.botMsg} ${styles.aiMsg} ${styles.typing}`}>
                <span className={styles.aiIcon}>🤖</span>
                <div className={styles.typingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={aiEnabled ? "Hỏi tôi bất cứ điều gì..." : "AI đang bảo trì..."}
              className={styles.input}
              disabled={!aiEnabled || isLoading}
            />
            <button 
              onClick={handleSend} 
              className={styles.sendBtn}
              disabled={!aiEnabled || isLoading}
            >
              {isLoading ? '⏳' : 'Gửi'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot; 