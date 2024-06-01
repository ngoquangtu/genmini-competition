const express = require('express');
const bodyParser = require('body-parser');
const gemini = require('./public/genmini-api');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', gemini);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
