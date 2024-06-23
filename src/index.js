const express = require('express');
const bodyParser = require('body-parser');
const { wsServer } = require('./public/genmini-api');
const http = require('http');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
