import React from 'react';
import Message from './Message';

const MessageList = ({ messages, currentStory, copied, setCopied, loading }) => {
  return (
    <div style={styles.messageContainerStyle}>
      {/* {messages.map((msg, index) => (
        <Message key={index} text={msg.text} isUser={msg.isUser} copied={copied} setCopied={setCopied} />
      ))} */}
      {messages.length > 0 && messages.map((msg, index) => (
        <Message key={index} text={msg.text} isUser={msg.isUser} copied={copied} setCopied={setCopied} />
      ))}
      {currentStory && (
        <Message key={'currentStory'} text={currentStory} isUser={false} copied={copied} setCopied={setCopied} />
      )}
      {loading && <Message text="AI is thinking..." isUser={false} />}
    </div>
  );
};

const styles = {
  messageContainerStyle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    overflowY: 'auto',
    padding: '1rem',
  },
};

export default MessageList;
