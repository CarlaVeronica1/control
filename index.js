/*const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});*/
/*
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const serverless = require("serverless-http");

const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
//app.use(express.json());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('¡Hola! El servidor está funcionando correctamente.');
});
app.use('/auth', authRoutes);

app.get('/test', (req, res) => {
  res.json({ message: "API funcionando" });
});

/*
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

//module.exports = app; 
module.exports = serverless(app);
*/
const express = require("express");
const serverless = require("serverless-http");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});

module.exports = serverless(app);