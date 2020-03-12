// Modules
require('babel-register');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan')('dev');

// Variables globales
const app = express();
const port = 8081;

//Middlewares
app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => {
  res.send('Okay');
});
//Lancement de l'application
app.listen(port, () => console.log('Started at port ' + port));
