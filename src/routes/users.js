const express = require('express');
const router = express.Router();
const registerController = require('../policies/registerPolicy');
const registerHandler = require('../controllers/userRegisterController');
const loginConroller = require('../policies/loginPolicy');
const loginHandler = require('../controllers/userLoginController');

router.post('/register', async (req, res) => {
  const error = await registerController(req, res);
  if (error) return res.status(400).send(error);
  await registerHandler(req, res);
});

router.post('/login', async (req, res) => {
  const error = await loginConroller(req, res);
  if (error) return res.status(400).send(error);
  await loginHandler(req, res);
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res
    .clearCookie('chat-app', { path: '/' })
    .clearCookie('io', { path: '/' })
    .status(200)
    .send('Logged out');
});

router.get('/checkLoginState', (req, res) => {
  if (req.session.user) {
    loginHandler(req, res);
  } else {
    res.end();
  }
});

module.exports = router;
