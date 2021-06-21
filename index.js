// aplikos kintamieji
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');

const mongoose = require('mongoose');

// jei bus heroku nustatytas portas mes imsime ji is aplinkos kintamuju
const PORT = process.env.PORT || 5000;

app.use(cors());
// middle ware - to get req.body in json
app.use(express.json());

const todoApi = require('./api/todoApi');

app.use('/', todoApi);

const rootBuild = path.join(__dirname, 'client', 'build');

// pasitikrinti ar musu aplika yra production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(rootBuild));

  // visas srautas nukreipiamas per producijos sukurta index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootBuild, 'index.html'));
  });
}

// prisijungimas prie duomenu bazes
mongoose
  .connect(process.env.MONGO_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('Conneced to Mongo ooooooooose');
    app.listen(PORT, console.log(`backEnd ondline on port ${PORT}`));
  })
  .catch((err) => console.error(err.message));
