const express = require('express');
const router = express.Router();
const GeminiController = require('../public/genminiController');

const controller = new GeminiController();

router.post('/generate-story', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).send({ error: "Prompt is required" });
  }

  try {
    let chunks = [];
    await controller.generateStory(prompt, (chunk) => {
      chunks.push(chunk);
    });
    res.status(200).send({ story: chunks });
  } catch (error) {
    res.status(500).send({ error: "Error generating story" });
  }
});

module.exports = router;
