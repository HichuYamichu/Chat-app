const express = require('express');
const router = express.Router();
const newServerController = require('../controllers/newServerController');
const newServerHandler = require('../handlers/newServer');


router.post('/new-server', async (req, res) => {
	const error = await newServerController(req, res);
	if (error) return res.status(400).send(error);
	await newServerHandler(req, res);
});

module.exports = router;
