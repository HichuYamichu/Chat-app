const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const registerHandler = require('../handlers/userRegister');
const loginConroller = require('../controllers/loginController');
const loginHandler = require('../handlers/userLogin');

router.post('/register', async (req, res) => {
	await registerController(req, res);
	await registerHandler(req, res);
});

router.post('/login', (req, res) => {
	loginConroller(req, res);
	loginHandler(req, res);
});

module.exports = router;
