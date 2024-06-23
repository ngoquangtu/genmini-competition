import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const Message = ({ text, isUser, copied, setCopied }) => {
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        ...styles.messageContainer,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          ...styles.messageStyle,
          backgroundColor: isUser ? '#7F9CF5' : '#F3F4F6',
          color: isUser ? '#FFFFFF' : '#374151',
        }}
      >
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <div style={styles.containerCode}>
                  <div style={styles.languageLabel}>{match[1]}</div>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                      style={styles.copyButton}
                    >
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
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const styles = {
  messageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10px',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  messageStyle: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    maxWidth: '20rem',
  },
  copyButton: {
    backgroundColor: '#4B5563',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  languageLabel: {
    backgroundColor: '#4B5563',
    color: '#FFFFFF',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    display: 'inline-block',
  },
  containerCode: {
    position: 'relative',
  },
};

export default Message;
