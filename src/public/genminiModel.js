const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
class GeminiModel {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: process.env.MAX_OUTPUT_TOKEN,
      temperature: process.env.TEMPERATURE,
      topP: process.env.TOP_P,
      topK:process.env.TOP_K,
    };
    this.history = [];
  }

  async generateStory(prompt,onChunk) {
    try {
      const model = this.genAI.getGenerativeModel({ model: process.env.GENMINI_MODEL });
      const chat = model.startChat({
        history: this.history,
        generationConfig: this.generationConfig
      });
      let result = await chat.sendMessageStream(prompt);
      for await (const chunk of result.stream) {
        // let chunkText = chunk.candidates[0].content.parts[0].text;
        const chunkText = chunk.text();
        onChunk(chunkText);

      }
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  }
  async generateAudio(file) {
    try {
      const response = await this.genAI.transcribeAudio({
        audio: file, // Đầu vào là tệp âm thanh
        config: {
          languageCode: "en-US", // Ngôn ngữ
          encoding: "LINEAR16", // Định dạng file
          sampleRateHertz: 16000, // Tần số mẫu
        },
      });
  
      if (response && response.results) {
        // Trích xuất kết quả từ phản hồi
        const transcription = response.results
          .map((result) => result.alternatives[0].transcript)
          .join(" ");
        console.log("Transcription:", transcription);
        return transcription;
      } else {
        throw new Error("No transcription results available.");
      }
    } catch (error) {
      console.error("Error generating audio transcription:", error.message);
      throw error;
    }
  }
  
}

module.exports = GeminiModel;
