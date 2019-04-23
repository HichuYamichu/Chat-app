const Database = require('../db/actions');
const sharedsession = require('express-socket.io-session');
const serverAuthMiddleware = require('../middleware/serverAuth');

module.exports = (io, sessionMiddleware, serverName, channelNames, userList) => {
  io.of(serverName).use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of(serverName).use(serverAuthMiddleware(serverName, channelNames));

  console.log(userList);
  io.of(serverName).users = userList;

  io.of(serverName).on('connection', socket => {
    console.log(`connected to ${serverName}`);
    if (io.of(serverName).users.map(user => user.username).includes(socket.user.username)) {
      io.of(serverName).users.find(user => user.username === socket.user.username).active = true;
    } else {
      io.of(serverName).users.push({ username: socket.user.username, active: true });
    }
    io.of(serverName).emit('updateActiveUsers', io.of(serverName).users);

    socket.on('init', data => {
      data.forEach(channel => {
        socket.join(channel);
      });
    });

    socket.on('disconnect', () => {
      console.log(`disconnected from ${serverName}`);
      io.of(serverName).users.find(user => user.username === socket.user.username).active = false;
      io.of(serverName).emit('updateActiveUsers', io.of(serverName).users);
    });

    socket.on('logout', () => socket.disconnect());

    socket.on('leaveServer', () => {
      Database.leaveServer(serverName, socket.user.username);
      socket.disconnect();
      io.of(serverName).users.filter(users => users.username !== socket.user.username);
      io.of(serverName).emit('updateActiveUsers', io.of(serverName).users);
    });

    socket.on('deleteServer', () => {
      Database.deleteServer(serverName);
      io.of(serverName).emit('serverDelete', serverName);
      Object.values(io.of(serverName).sockets).forEach(connectedSocket => {
        connectedSocket.disconnect();
      });
      delete io.nsps[`/${serverName}`];
    });

    socket.on('messageSend', data => {
      if (!socket.user.permissions.sendMessages) return;
      Database.insertMessage(serverName, data.channel, data.message);
      io.of(serverName)
        .in(data.channel)
        .emit('messageRecived', data);
    });

    socket.on('fetchMessages', async data => {
      const messages = await Database.fetchMessages(
        serverName,
        data.channel,
        data.lastMesssageTimestamp
      );
      socket.emit('updateMessages', { messages, channelName: data.channel });
    });

    socket.on('createChannel', async data => {
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (format.test(data)) {
        return socket.emit('errorOccured', 'Illegal character in channel name!');
      }
      const taken = await Database.checkChannelNames(serverName, data);
      if (taken) {
        return socket.emit('errorOccured', 'Channel name taken');
      }
      Object.values(io.of(serverName).sockets).forEach(connectedSocket =>
        connectedSocket.join(data));

      const channel = { channelName: data, messages: [] };
      Database.addChannel(serverName, channel);
      io.of(serverName).emit('addChannel', channel);
    });

    socket.on('deleteChannel', async channelName => {
      if (channelName === 'main') {
        return socket.emit('errorOccured', 'You can not delete main channel');
      }
      const exists = await Database.checkChannelNames(serverName, channelName);
      if (exists) {
        Database.deleteChannel(serverName, channelName);
        Object.values(io.of(serverName).sockets).forEach(connectedSocket => {
          connectedSocket.leave(channelName);
        });
        io.of(serverName).emit('channelDeleted', channelName);
      } else {
        socket.emit('errorOccured', 'There is no channel with that name');
      }
    });

    socket.on('updateRoles', roles => {
      Database.updateRoles(serverName, roles);
      Object.values(io.of(serverName).sockets).forEach(connectedSocket => {
        const newUserRoles = roles.filter(role =>
          role.roleMembers.includes(connectedSocket.user.username));
        const userPermissions = {};
        const permissions = newUserRoles.map(role => role.permissions);
        permissions.forEach(permissionSet => {
          Object.entries(permissionSet).forEach(permission => {
            if (permission[1]) userPermissions[permission[0]] = permission[1];
          });
        });
        connectedSocket.user.permissions = userPermissions;
      });
      io.of(serverName).emit('updateRoles', roles);
    });

    socket.on('updateUserRole', async data => {
      if (data.actionType === 'assign') {
        const {
          value: { roles }
        } = await Database.addUserToRole(serverName, data.role, data.user);
        const connectedUser = Object.values(io.of(serverName).sockets).find(
          connectedSocket => connectedSocket.user.username === data.user
        );
        if (connectedUser) {
          Object.entries(roles[0].permissions).forEach(permission => {
            if (permission[1]) {
              Object.values(io.of(serverName).sockets).find(
                connectedSocket => connectedSocket.user.username === data.user
              ).user.permissions[permission[0]] = permission[1];
            }
          });
        }
      } else if (data.actionType === 'remove') {
        const {
          value: { roles }
        } = await Database.removeUserFromRole(serverName, data.role, data.user);
        const updatedUserRoles = roles.filter(
          role => role.roleMembers.includes(data.user) && role.roleName !== data.role
        );
        const userPermissions = {};
        const permissions = updatedUserRoles.map(role => role.permissions);
        permissions.forEach(permissionSet => {
          Object.entries(permissionSet).forEach(permission => {
            if (permission[1]) userPermissions[permission[0]] = permission[1];
          });
        });
        Object.values(io.of(serverName).sockets).find(
          connectedSocket => connectedSocket.user.username === data.user
        ).user.permissions = userPermissions;
        console.log(socket.user.permissions);
      }
      io.of(serverName).emit('updateUserRole', data);
    });
  });
};
