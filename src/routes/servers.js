const express = require('express');
const router = express.Router();
const mainPageVisitHandler = require('../controllers/mainPageVisitController');

router.get('/public', (req, res) => {
  mainPageVisitHandler(req, res);
});

module.exports = router;
