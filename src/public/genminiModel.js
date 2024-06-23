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
      let chunks=[];
      let result = await chat.sendMessageStream(prompt);
      for await (const chunk of result.stream) {
        // let chunkText = chunk.candidates[0].content.parts[0].text;
        const chunkText = chunk.text();
        chunks.push(chunkText);
        onChunk(chunkText);

      }
      return chunks.join(" ");
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  }
}

module.exports = GeminiModel;
