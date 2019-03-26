const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const registerHandler = require('../handlers/userRegisterHandler');
const loginConroller = require('../controllers/loginController');
const loginHandler = require('../handlers/userLoginHandler');

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

module.exports = router;
