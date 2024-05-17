const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

class Gemini {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.API_KEY);
    this.generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 2000,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };
  }

  async  generateStory(prompt) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt,this.generationConfig);
      console.log("Result object:", JSON.stringify(result, null, 2));

      const text = result.response?.candidates[0]?.content?.parts[0]?.text || "No generated text found";

      return text;
    } catch (error) {
      // Handle errors and re-throw for handling in the route
      console.error(error);
      throw error;
    }
  }
}

module.exports = Gemini;
