const Database = require('../db/actions');

module.exports = async serverData => {
  const format = /[^a-zA-Z]/;
  if (format.test(serverData.serverName)) {
    return 'Illegal character in server name!';
  }
  const isTaken = await Database.checkServerNames(serverData.serverName);
  if (isTaken) {
    return 'Name already taken';
  }
  if (serverData.icon && serverData.icon.byteLength > 1000000) {
    return 'Icon too big max size 1MB';
  }
};
