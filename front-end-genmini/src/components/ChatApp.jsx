import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCopy } from '@fortawesome/free-solid-svg-icons';

const ChatApp = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPromptEmpty, setIsPromptEmpty] = useState(true); // State để theo dõi nếu prompt trống

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

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
    if (prompt.trim()) {
      setMessages([...messages, { text: prompt, isUser: true }]);
      setPrompt('');
      setIsPromptEmpty(true);

      try {
        setPrompt('');
        const response = await axios.post('http://localhost:8000/api/generate-story', { prompt });
        if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
          const story = response.data.story;
          // Ensure the returned code is wrapped in a Markdown code block
          const formattedStory = `\`\`\`\n${story}\n\`\`\``;
          setMessages((prevChatHistory) => [ ...prevChatHistory, { text: formattedStory, isUser: false }]);
        } 
      } catch(err) {
        throw err;
      }
      setLoading(false);
    }
  };

  return (
    <div style={styles.containerStyle}>
      <header style={styles.headerStyle}>
        <h1 style={styles.titleStyle}>ChatGPT</h1>
        <button style={styles.buttonStyle}>New Chat</button>
      </header>
      <main style={styles.mainStyle}>
        <div style={styles.messageContainerStyle}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageStyle,
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: msg.isUser ? '#cbd5e1' : '#ebf4ff',
                color: msg.isUser ? '#374151' : '#2563eb',
              }}
            >
              <p>
                <ReactMarkdown>{msg.text}</ReactMarkdown> 
              </p>
              {
                msg.isUser === 'false' && (
                  <button
                    onClick={() => copyToClipboard(msg.text.replace(/```/g, ''))}
                    style={styles.copyButton}
                  >
                    <FontAwesomeIcon icon={faCopy} /> Copy Code
                  </button>
                )
              }
            </div>
          ))}
          {loading && <p style={styles.botMessage}>AI is thinking...</p>}
        </div>
      </main>
      <footer style={styles.footerStyle}>
        <img
          aria-hidden="true"
          alt="message icon"
          src="../public/logo192.png"
          style={styles.iconStyle}
        />
        <input
          type="text"
          style={styles.inputStyle}
          placeholder="Type your message..."
          value={prompt}
          onChange={handleChange}
        />
        <button
          style={styles.sendButtonStyle}
          onClick={handleSubmit}
          disabled={isPromptEmpty}

        >
          Send
        </button>
      </footer>
    </div>
  );
};

const styles = {
  containerStyle: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f4f8',
    color: '#374151',
  },
  headerStyle: {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  buttonStyle: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
  },
  mainStyle: {
    flexGrow: '1',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    overflowY: 'auto',
  },
  messageContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  messageStyle: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    maxWidth: '20rem',
  },
  footerStyle: {
    padding: '1rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {
    width: '1.5rem',
    height: '1.5rem',
  },
  inputStyle: {
    flexGrow: '1',
    padding: '0.5rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out',
  },
  sendButtonStyle: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
  },
  copyButton: {
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  botMessage: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'left',
    marginBottom: '10px',
    maxWidth: '100%',
    alignSelf: 'flex-start',
    wordWrap: 'break-word', // Ensure long words break and wrap
    whiteSpace: 'pre-wrap', // Preserve white space and wrap text
},
};

export default ChatApp;
