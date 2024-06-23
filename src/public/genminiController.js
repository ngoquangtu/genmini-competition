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
  }

  module.exports = GeminiController;
