import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Gửi ý kiến phản hồi tới server ở đây (ví dụ: sử dụng API)
    console.log('Gửi ý kiến phản hồi:', feedback);
    // Sau khi gửi, có thể xóa nội dung form hoặc hiển thị thông báo thành công
    setFeedback('');
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textarea: {
      width: '300px',
      height: '150px',
      margin: '0.5rem',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #ccc',
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
      <h1 style={styles.title}>Gửi ý kiến phản hồi</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          value={feedback}
          onChange={handleChange}
          placeholder="Nhập ý kiến của bạn..."
          style={styles.textarea}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Gửi
        </button>
      </form>
      <Link to="/chat" style={{ marginTop: '2rem', color: '#fff', textDecoration: 'none' }}>
        Quay lại trang chat
      </Link>
    </div>
  );
}

export default FeedbackForm;
