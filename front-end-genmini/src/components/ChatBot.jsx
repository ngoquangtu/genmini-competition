import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatApp = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPromptEmpty, setIsPromptEmpty] = useState(true);
  const [copied, setCopied] = useState(false);
  const webSocket = useRef(null);
  const [currentStory, setCurrentStory] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setPrompt(value);
    setIsPromptEmpty(value.trim() === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!prompt.trim()) {
      setLoading(false);
      return;
    }
    if (webSocket.current) {
      webSocket.current.close();
    }
    webSocket.current = new WebSocket(`ws://localhost:8000`);
    if (prompt.trim()) {
      setMessages([...messages, { text: prompt, isUser: true }]);
      setPrompt('');
      setIsPromptEmpty(true);

      try {
        webSocket.current.onopen = () => {
          console.log('WebSocket connection opened');
          webSocket.current.send(JSON.stringify({ prompt }));
        };
        webSocket.current.onmessage = (event) => {
          const data = event.data;
          setCurrentStory((prev) => prev + data); // Cập nhật currentStory từ server
          setLoading(false);
          setMessages((prevChatHistory) => [
            ...prevChatHistory,
            { text: data, isUser: false }, // Thêm tin nhắn từ server vào danh sách
          ]);
          setCurrentStory()
        };
        webSocket.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setLoading(false);
        };
        webSocket.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      } catch (err) {
        console.error('Error generating story:', err);
      }
    }
  };

  return (
    <div style={styles.containerStyle}>
      <main style={styles.mainStyle}>
        <MessageList
          messages={messages}
          currentStory={currentStory}
          copied={copied}
          setCopied={setCopied}
          loading={loading}
        />
      </main>
      <ChatInput
        prompt={prompt}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isPromptEmpty={isPromptEmpty}
      />
    </div>
  );
};

const styles = {
  containerStyle: {
    minHeight: '92.1vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9FAFB',
    color: '#374151',
    overflowY:'auto',
  },
  mainStyle: {
    flexGrow: '1',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflowY: 'auto',
  },
};

export default ChatApp;
