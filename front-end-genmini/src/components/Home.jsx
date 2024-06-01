import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(to right, #00c6ff, #0072ff)',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    button: {
      padding: '1rem 2rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fff',
      background: isHovered ? '#0056b3' : '#007bff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HUST Bot</h1>
      <Link to="/chat">
        <button
          style={styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Bắt đầu ngay
        </button>
      </Link>
    </div>
  );
}

export default Home;
