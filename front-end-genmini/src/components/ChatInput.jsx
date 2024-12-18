import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

const ChatInput = ({ prompt, handleChange, handleSubmit, isPromptEmpty }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Ghi âm audio
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          audioChunks.current = [];
          const url = URL.createObjectURL(audioBlob);
          uploadAudio(audioBlob);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Microphone access error:', error);
      }
    }
  };
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };


  // Gửi audio về backend
  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://localhost:8000/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Transcription:', data.text);
      handleSubmit(data.text);
      
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

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
        onClick={() => handleSubmit(prompt)}
        disabled={isPromptEmpty}
      >
        Send
      </button>

      {/* Nút ghi âm với icon microphone */}
      <button
        onClick={toggleRecording}
        style={{
          backgroundColor: isRecording ? 'red' : '#FFEB3B',
          color: '#FFFFFF',
          padding: '0.3rem',
          marginLeft: '1rem',
          border: 'none',
          borderRadius: '100%',
        }}
      >
        <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} size="2x" />
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
    border: '1px solid #E5E7EB',
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
