const Database = require('../db/actions');

module.exports = async (req, res) => {
  const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (format.test(req.body.username)) return { error: 'Illegal character in username!' };

  if (req.body.password.length < 8) return { error: 'Password must be at lest 8 characters long!' };

  const isTaken = await Database.checkUserNames(req.body.username);
  if (isTaken) return { error: 'Username already taken' };
};
