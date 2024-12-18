import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDmmvNoKv357KBGJHIIWHVrproEELfWLWg');
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const chat = model.startChat({
  // This could also be set on the model.
  tools: [
    {
      codeExecution: {},
    },
  ],
});

const result = await chat.sendMessage(
  'What is the sum of the first 50 prime numbers? ' +
    'Generate and run code for the calculation, and make sure you get all 50.',
);
const response = result.response;
console.log(response.text());