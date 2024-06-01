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
    this.history=[];
  }

  async generateStory(prompt, onChunk) {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      const chat = model.startChat({
        history :this.history,
        generationConfig:this.generationConfig
      });
      let result=await chat.sendMessageStream(prompt);
      //  result = await model.generateContentStream(prompt, this.generationConfig);



      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        onChunk(chunkText); // Call the callback with the chunk text
      }
        fetch('localhost:3000/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result.response)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
      // this.history.push(
      //   { role: "user", parts: [{ text: prompt }] },
      //   { role: "model", parts: [{ text: result.candidates[0].content.parts[0].text }] }
      // );
    } catch (error) {
      console.error("Error generating story:", error);
      throw error;
    }
  }
}

module.exports = Gemini;
