let db, config;

module.exports = (_db, _config) => {
  db = _db;
  config = _config;
  return Members;
};

const Members = class {
  /* 
  =============== 
  GET 
  =============== */

  static getById(id) {
    return new Promise(next => {
      db.query('SELECT * FROM members WHERE id = ?', [id])
        .then(res => {
          res[0] != undefined ? next(result[0]) : next(new Error(config.errors.wrongID));
        })
        .catch(err => {
          next(err);
        });
    });
  }

  static getAll(max) {
    return new Promise(next => {
      if (max != undefined && max > 0) {
        db.query('SELECT * FROM members LIMIT 0, ?', [parseInt(max)])
          .then(result => next(result))
          .catch(err => next(err));
      } else if (max != undefined) next(new Error(config.errors.wrongMaxValue));
      else {
        db.query('SELECT * FROM members')
          .then(result => next(result))
          .catch(err => next(err));
      }
    });
  }
  /* 
  =============== 
  ADD 
  =============== */
  static add(name) {
    return new Promise(next => {
      if (name && name.trim() != '') {
        name = name.trim();

        db.query('SELECT * FROM members WHERE name = ?', [name])
          .then(result => {
            if (result[0] != undefined) next(new Error(config.errors.nameAlreadyTaken));
            else db.query('INSERT INTO members(name) VALUES(?)', [name]);
          })
          .then(() => db.query('SELECT * FROM members WHERE name = ?', [name]))
          .then(result => {
            next({
              id: result[0].id,
              name: result[0].name
            });
          })
          .catch(err => next(err));
      } else next(new Error(config.errors.noNameValue));
    });
  }
  /* 
  =============== 
  UPDATE 
  =============== */
  static update(id, name) {
    return new Promise(next => {
      if (name && name.trim() != '') {
        name = name.trim();
        db.query('SELECT * FROM members WHERE id = ?', [id])
          .then(result => {
            if (result[0] != undefined) db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id]);
            else next(new Error(config.errors.wrongID));
          })
          .then(result => {
            if (result[0] != undefined) {
              next(new Error(config.errors.sameName));
            } else {
              return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id]);
            }
          })
          .then(() => {
            next(true);
          })
          .catch(err => next(err));
      }
    });
  }
  /* 
  =============== 
  DELETE 
  =============== */
  static delete(id) {
    return new Promise(next => {
      db.query('SELECT * FROM members WHERE id = ?', [id])
        .then(result => {
          if (result[0] != undefined) db.query('DELETE FROM members WHERE id = ?', [id]).then(() => next(true));
          else next(new Error(config.errors.sameName));
        })
        .catch(err => next(err));
    });
  }
};
