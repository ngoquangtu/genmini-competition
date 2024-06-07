import React, { useEffect, useState, useRef } from 'react';

const TextStream = () => {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const socket = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setText(''); // Clear previous text

    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket(`ws://localhost:8000`);
    
    socket.current.onopen = () => {
      console.log('WebSocket connection opened');
      socket.current.send(JSON.stringify({ prompt }));
    };

    socket.current.onmessage = (event) => {
      setText((prevText) => prevText + event.data);
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.current.close();
    };

    socket.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  useEffect(() => {
    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>Streaming Text</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit">Submit</button>
      </form>
      <p>{text}</p>
    </div>
  );
};

export default TextStream;
