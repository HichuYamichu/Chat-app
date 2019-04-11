const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
let sessionMiddleware;

module.exports.init = db => {
  const store = new MongoStore({ db });

  sessionMiddleware = session({
    name: 'chat-app',
    store: store,
    secret: process.env.SECRET || 'HIdi}65saUB.fws8DAL.;fPOq,(3',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60
    }
  });
};

module.exports.getSession = () => sessionMiddleware;
