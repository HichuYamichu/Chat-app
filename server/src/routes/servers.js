const express = require('express');
const router = express.Router();
const newServerController = require('../controllers/newServerController');
const newServerHandler = require('../handlers/newServer');


router.post('/new-server', async (req, res) => {
	newServerController(req, res);
	console.log('fsdfds');
	newServerHandler(req, res);
});

module.exports = router;
