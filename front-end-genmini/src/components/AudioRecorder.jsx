import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState(""); // Trạng thái để lưu kết quả transcription
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks.current = [];
      uploadAudio(audioBlob); // Gửi audio đến server
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioBlob = new Blob([file], { type: file.type });
      uploadAudio(audioBlob); // Gửi file upload đến server
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    try {
      const response = await fetch("http://localhost:8000/api/speech-to-text", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setTranscription(data.text); // Lưu kết quả transcription
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div>
      <div>
        <button onClick={recording ? stopRecording : startRecording}>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ marginLeft: "10px" }}
        />
      </div>
      {audioURL && (
        <div>
          <h4>Recorded Audio:</h4>
          <audio src={audioURL} controls />
        </div>
      )}
      {transcription && (
        <div>
          <h4>Transcription:</h4>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
