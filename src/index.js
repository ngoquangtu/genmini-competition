const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Gemini = require("../src/public/gemini.js");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const gemini = new Gemini();

// Route for the homepage
app.get("/", (req, res) => {
  var generatedStory = "";
  res.render("index", { generatedStory });
});

// Route to handle POST requests from the form
app.post("/", async (req, res) => {
  try {
    // Get input text from the request body
    const { inputText } = req.body;

    // Generate story using gemini object
    const generatedStory = await gemini.generateStory(inputText);
    if (!generatedStory) {
      throw new Error("Failed to generate story");
    }

    // Render the index page with the generated story
    res.render("index", { generatedStory });
  } catch (error) {
    console.error(error);
    // Provide a more informative error message to the user
    res.status(500).send("An error occurred while generating the story. Please try again later.");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
