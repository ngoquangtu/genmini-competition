import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCopy } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!prompt) {
      setError('Please enter your prompt.');
      setLoading(false);
      return;
    }

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { type: 'user', message: prompt }
    ]);

    try {
      setPrompt('');
      const response = await axios.post('http://localhost:8000/api/generate-story', { prompt });
      if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        const story = response.data.story;

        // Ensure the returned code is wrapped in a Markdown code block
        const formattedStory = `\`\`\`\n${story}\n\`\`\``;

        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          { type: 'bot', message: formattedStory }
        ]);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response from the server. Please try again later.');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      setError('Error generating story. Please try again later.');
    }
    setLoading(false);
    
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div style={styles.container1}>
      <div style={styles.container}>
        <div style={styles.conversation}>
          {chatHistory.map((chat, index) => (
            <div key={index} style={chat.type === 'user' ? styles.userMessage : styles.botMessage}>
              <ReactMarkdown>{chat.message}</ReactMarkdown>
              {chat.type === 'bot' && (
                <button
                  onClick={() => copyToClipboard(chat.message.replace(/```/g, ''))}
                  style={styles.copyButton}
                >
                  <FontAwesomeIcon icon={faCopy} /> Copy Code
                </button>
              )}
            </div>
          ))}
          {loading && <p style={styles.botMessage}>AI is thinking...</p>}
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <textarea
              value={prompt}
              onChange={handleChange}
              placeholder="Start typing here..."
              style={styles.textarea}
            />
            <button type="submit" style={styles.iconButton}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          </div>
          <div style={styles.errorMessage}>{error && <p style={styles.error}>{error}</p>}</div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container1: {
    paddingBottom: '200px',
    paddingTop: '40px',
    backgroundColor: '#f0f0f0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    paddingTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    marginBottom: '20px',
    paddingTop: '20px',
  },
  textarea: {
    width: '100%',
    margin: '10px 0',
    padding: '10px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '5px',
    resize: 'none',
    overflowY: 'auto',
    minHeight: '3rem',
    maxHeight: 'none',
  },
  iconButton: {
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    outline: 'none',
    transition: 'background-color 0.3s ease',
    marginLeft: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  conversation: {
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    maxHeight: '400px',
    minHeight: '400px',
    borderRadius: '10px',
    wordWrap: 'break-word', // Ensure long words break and wrap
  },
  userMessage: {
    backgroundColor: '#e0e0e0',
    color: '#333',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'left',
    marginBottom: '10px',
    maxWidth: '100%',
    alignSelf: 'flex-end',
    wordWrap: 'break-word', 
    whiteSpace: 'pre-wrap', // Preserve white space and wrap text
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
  copyButton: {
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default ChatBot;
