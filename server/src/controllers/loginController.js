const Database = require('../db/actions');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
  const user = await Database.getPasswordHash(req.body.username);
  if (!user) return { error: 'Username not found!' };
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return { error: 'Wrong password!' };
};
