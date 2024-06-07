import React, { useState,useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatApp = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isPromptEmpty, setIsPromptEmpty] = useState(true);
  const [copied, setCopied] = useState(false);
  const webSocket=useRef(null);

  const copyIcon = copied ? (
    <span title="Copied">
      <FontAwesomeIcon icon={faCheck} /> Copied
    </span>
  ) : (
    <span title="Copy">
      <FontAwesomeIcon icon={faCopy} /> Copy
    </span>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
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
    if(webSocket.current)
    {
      webSocket.current.close();
    }
    webSocket.current=new WebSocket(`ws://localhost:8000`);
    if (prompt.trim()) {
      setMessages([...messages, { text: prompt, isUser: true }]);
      setPrompt('');
      setIsPromptEmpty(true);

      try {
        webSocket.current.onopen = () => {
          console.log('WebSocket connection opened');
          webSocket.current.send(JSON.stringify({ prompt }));
        };
        // // const response = await axios.post('http://localhost:8000/api/generate-story', { prompt });
        // if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        //   const story = response.data.story;
        //   setMessages((prevChatHistory) => [
        //     ...prevChatHistory,
        //     { text: story.join(''), isUser: false },
        //   ]);
        // } else {
        //   console.error('Response is not JSON');
        // }
        webSocket.current.onmessage = (event) => {
          // const {story} = JSON.parse(event.data);
          const story =event.data;
          
          setMessages((prevChatHistory) => [
            ...prevChatHistory,
            { text: story, isUser: false },
          ]);
          setLoading(false);
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
        <div style={styles.messageContainerStyle}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageStyle,
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: msg.isUser ? '#7F9CF5' : '#F3F4F6',
                color: msg.isUser ? '#FFFFFF' : '#374151',
              }}
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div style={ styles.containerCode}>
                        <div style={styles.languageLabel}>{match[1]} </div>
                        {!msg.isUser && (
                            <button
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                            style={styles.copyButton}>
                                {copyIcon}
                              </button>
                        )}
                        <SyntaxHighlighter 
                        
                          children={String(children).replace(/\n$/, '')}
                          style={materialDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
             
            </div>
          ))}
          {loading && <p style={styles.botMessage}>AI is thinking...</p>}
        </div>
      </main>
      <footer style={styles.footerStyle}>
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
    backgroundColor: '#F9FAFB',
    color: '#374151',
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
    borderRadius: '0.5rem',
    maxWidth: '20rem',
  },
  footerStyle: {
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    boxShadow: '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputStyle: {
    flexGrow: '1',
    padding: '0.5rem',
    border: '1px solid #E5E7EB ',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out',
  },
  sendButtonStyle: {
    backgroundColor: '#7F9CF5',
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    marginLeft: '1rem',
    cursor: 'pointer',
  },
  copyButton: {
    backgroundColor: '#4B5563',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  botMessage: {
    backgroundColor: '#7F9CF5',
    color: '#FFFFFF',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    textAlign: 'left',
    marginBottom: '10px',
    alignSelf: 'flex-start',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  languageLabel: {
    backgroundColor: '#4B5563',
    color: '#FFFFFF',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    display: 'inline-block',
  },
};

export default ChatApp;
