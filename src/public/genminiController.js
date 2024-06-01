const GeminiModel = require('../public/genminiModel');
require("dotenv").config();

class GeminiController {
  constructor() {
    this.model = new GeminiModel(process.env.API_KEY);
  }

  async generateStory(prompt, onChunk) {
    try {
      await this.model.generateStory(prompt, onChunk);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GeminiController;
