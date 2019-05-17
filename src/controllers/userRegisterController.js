const { ObjectID } = require('mongodb');
const Database = require('../db/actions');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) throw err;
    const { ops } = await Database.insertUser({
      _id: new ObjectID().toString(),
      username: req.body.username,
      password: hash,
      memberOf: []
    });
    delete ops.password;
    req.session.user = ops[0];
    res.send(ops[0]);
  });
};
