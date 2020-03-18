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
  res.redirect('/members')
});

// Page récupérant tous les membres
app.get('/members', (req, res) => {
  apiCall(req.query.max ? '/members?max=' + req.query.max : '/members', 'get', {}, res, result => {
    res.render('members.twig', {
      members: result
    });
  });
});

// Page récupérant un seul membre
app.get('/members/:id', (req, res) => {
  apiCall('/members/' + req.params.id,'get', {}, res, result => {
    res.render('member.twig', {
      member: result
    });
  });
});

// Page de modification d'un membre
app.get('/edit/:id', (req, res) => {
  apiCall('/members/' + req.params.id, 'get', {}, res, result => {
    res.render('edit.twig', {
      member: result
    });
  });
});

app.post('/edit/:id', (req, res) => {
  apiCall('/members/' + req.params.id, 'put', {
    name: req.body.name
  }, res, () => {
    res.redirect('/members')
  })
})
//Lancement de l'application
app.listen(port, () => console.log('Started at port ' + port));

// Fonctions
function renderError(res, errMsg) {
  res.render('error.twig', {
    errorMsg: errMsg
  });
}

function apiCall(url, method, data, res, next) {
  fetch({
    method: method,
    url: url,
    data: data
  })
    .then(response => {
      if (response.data.status === 'success') {
        next(response.data.result);
      } else {
        renderError(res, response.data.message);
      }
    })
    .catch(err => renderError(res, err.message));
}
