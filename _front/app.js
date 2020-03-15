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
  apiCall(req.query.max ? '/members?max=' + req.query.max : '/members', res, result => {
    res.render('members.twig', {
      members: result
    });
  });
});

// Page récupérant un seul membre
app.get('/members/:id', (req, res) => {
  apiCall('/members/' + req.params.id, res, result => {
    res.render('member.twig', {
      member: result
    });
  });
});

//Lancement de l'application
app.listen(port, () => console.log('Started at port ' + port));

// Fonctions
function renderError(res, errMsg) {
  res.render('error.twig', {
    errorMsg: errMsg
  });
}

function apiCall(url, res, next) {
  fetch
    .get(url)
    .then(response => {
      if (response.data.status === 'success') {
        next(response.data.result);
      } else {
        renderError(res, response.data.message);
      }
    })
    .catch(err => renderError(res, err.message));
}
