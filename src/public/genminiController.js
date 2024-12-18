  const GeminiModel = require('../public/genminiModel'); 
  require("dotenv").config();

  class GeminiController {
    constructor() {
      this.geminiModel = new GeminiModel(process.env.API_KEY); 
    }

    async generateStory(prompt, onChunk) {
      try {
      await this.geminiModel.generateStory(prompt,onChunk);
        
      } catch (error) {
        throw error;
      }
    }
    async generateAudio(audioFile) {
      try {
        // Gọi phương thức từ GeminiModel để xử lý âm thanh
        const transcription = await this.geminiModel.generateAudio(audioFile);
        return transcription;
      } catch (error) {
        console.error("Error in GeminiController.generateAudio:", error);
        throw error;
      }
    }
  }

  module.exports = GeminiController;
