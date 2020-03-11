require('babel-register');
const { success, error, checkAndChange } = require('./assets/functions');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan')('dev');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const config = require('./assets/config');

mysql
  .createConnection({
    host: config.db.post,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
  })
  .then(db => {
    console.log('Connected.');
    const app = express();
    let MembersRouter = express.Router();
    let Members = require('./assets/classes/Members')(db, config);
    app.use(morgan);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(config.rootAPI + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    MembersRouter.route('/:id')
      // Récupère un membre avec son ID
      .get(async (req, res) => {
        let member = await Members.getById(req.params.id);
        console.log('hey');
        res.json(checkAndChange(member));
      })

      // Modifie un membre avec son ID
      .put(async (req, res) => {
        let updateMember = await Members.update(req.params.id, req.body.name);
        res.json(checkAndChange(updateMember));
      })

      // Supprime un membre avec son ID
      .delete(async (req, res) => {
        let deleteMember = await Members.delete(req.params.id);
        res.json(checkAndChange(deleteMember));
      });

    MembersRouter.route('/')
      // Récupère tous les membres
      .get(async (req, res) => {
        let allMembers = await Members.getAll(req.query.max);
        res.json(checkAndChange(allMembers));
      })

      // Ajoute un membre avec son nom
      .post(async (req, res) => {
        let addMember = await Members.add(req.body.name);
        res.json(checkAndChange(addMember));
      });

    app.use(config.rootAPI + 'members', MembersRouter);

    app.listen(config.port, () => console.log('Started on port ' + config.port));
  })
  .catch(err => console.log('Error during the connection', err.message));
