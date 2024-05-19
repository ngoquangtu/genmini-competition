
const path = require("path");
require("dotenv").config();
const socketIo = require("socket.io");
const Gemini = require("../src/public/gemini.js"); // Adjust the path if needed
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const gemini = new Gemini();

app.get("/", (req, res) => {
  res.render("index", { generatedStory: "" });
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("generateStory", async (prompt) => {
    try {
      await gemini.generateStory(prompt, (chunkText) => {
        socket.emit("storyChunk", chunkText);
      });
      socket.emit("storyEnd");
    } catch (error) {
      console.error(error);
      socket.emit("error", "An error occurred while generating the story. Please try again later.");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
