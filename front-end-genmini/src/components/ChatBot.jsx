import React, { useState } from 'react';
import axios from 'axios';

function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStory([]);

    if (!prompt) {
      setError('Prompt is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/generate-story', { prompt });
      setStory(response.data.story);
    } catch (err) {
      setError('Error generating story');
    }
  };

  return (
    <div style={styles.chatBot}>
      <header style={styles.header}>
        <h1>Story Generator ChatBot</h1>
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={handleChange}
            placeholder="Enter your prompt here"
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Generate Story</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.story}>
          {story.map((chunk, index) => (
            <p key={index}>{chunk}</p>
          ))}
        </div>
      </header>
    </div>
  );
}

const styles = {
  chatBot: {
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
  textarea: {
    width: '80%',
    height: '100px',
    margin: '10px 0',
    padding: '10px',
    fontSize: '1em',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  story: {
    marginTop: '20px',
    width: '80%',
    textAlign: 'left',
  },
};

export default ChatBot;
