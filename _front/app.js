// Modules
require('babel-register');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan')('dev');
const twig = require('twig');
const axios = require('axios');

// Variables globales
const app = express();
const port = 8081;
const fetch = axios.create({
  baseURL: 'http://localhost:8080/api/v1/'
});

//Middlewares
app.use(morgan);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES

// Page d'accueil
app.get('/', (req, res) => {
  res.render('index.twig', {
    name: req.params.name
  });
});

// Page récupérant tous les membres
app.get('/members', (req, res) => {
  fetch
    .get('members')
    .then(response => {
      if (response.data.status === 'success') {
        res.render('members.twig', {
          members: response.data.result
        });
      } else {
        renderError(res, response.data.message);
      }
      console.log(response.data);
    })
    .catch(err => renderError(res, err.message));
});

// Page récupérant un seul membre

//Lancement de l'application
app.listen(port, () => console.log('Started at port ' + port));

// Fonctions
function renderError(res, errMsg) {
  res.render('error.twig', {
    errorMsg: errMsg
  });
}
