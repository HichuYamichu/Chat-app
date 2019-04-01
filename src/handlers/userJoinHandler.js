const Database = require('../db/actions');

module.exports = async (req, res) => {
  try {
    const { _id } = await Database.getServerID(req.query.serverName);
    if (!_id) throw new Error('server not found');
    await Database.userJoin(_id, req.session.user.username);
    const server = await Database.retriveServers([_id]);
    server[0].roles.forEach(role => {
      req.session.user.accessList.push({
        disallowedChannels: role.disallowedChannels,
        permissions: role.permissions,
        serverName: req.query.serverName
      });
    });
    res.send(server[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};
