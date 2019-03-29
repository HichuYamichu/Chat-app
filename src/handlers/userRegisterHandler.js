const Database = require('../db/actions');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) throw err;
    const user = await Database.insertUser({ username: req.body.username, password: hash, memberOf: [], permissions: [] });
    res.send(user.ops[0]);
  });
};
