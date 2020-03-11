let db, config;

module.exports = (_db, _config) => {
  db = _db;
  config = _config;
  return Members;
};

const Members = class {
  static getById(id) {
    return new Promise(next => {
      db.query('SELECT * FROM members WHERE id = ?', [id])
        .then(res => {
          res[0] != undefined ? next(result[0]) : next(new Err('Wrong id'));
        })
        .catch(err => {
          next(err);
        });
    });
  }
};
