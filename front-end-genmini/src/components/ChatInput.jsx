import React from 'react';

const ChatInput = ({ prompt, handleChange, handleSubmit, isPromptEmpty }) => {
  return (
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
  );
};

const styles = {
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
};

export default ChatInput;
