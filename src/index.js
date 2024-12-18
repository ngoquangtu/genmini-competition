const express = require('express');
const bodyParser = require('body-parser');
const { wsServer } = require('./public/genmini-api');
const http = require('http');
const multer = require("multer");
const GeminiController = require('./public/genminiController');
const upload = multer({ dest: "uploads/" }); 
const geminiController = new GeminiController();
const cors = require('cors');
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
app.post("/api/speech-to-text", upload.single("file"), async (req, res) => {
  try {
    const audioFilePath = req.file.path;

    // Upload file âm thanh lên AssemblyAI
    const fileUploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fs.createReadStream(audioFilePath),
      {
        headers: {
          authorization: '834ab50fbc854745bc594a465f6d86cc',
          "Transfer-Encoding": "chunked",
        },
      }
    );

    // Lấy URL file âm thanh từ response
    const audioUrl = fileUploadResponse.data.upload_url;

    // Gửi yêu cầu chuyển đổi Speech-to-Text
    const transcriptionResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: audioUrl },
      {
        headers: {
          authorization: '834ab50fbc854745bc594a465f6d86cc',
        },
      }
    );

    const transcriptId = transcriptionResponse.data.id;

    // Chờ kết quả (Polling trạng thái)
    let transcriptResult;
    while (true) {
      const statusResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: '834ab50fbc854745bc594a465f6d86cc',
          },
        }
      );
      transcriptResult = statusResponse.data;

      if (transcriptResult.status === "completed") {
        break;
      } else if (transcriptResult.status === "failed") {
        throw new Error("Transcription failed");
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); 
    }

    res.json({ text: transcriptResult.text });


    fs.unlinkSync(audioFilePath);
  } catch (error) {
    console.error("Error in speech-to-text API:", error.message);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
