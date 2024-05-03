/* Loads the Express Modules and Uses it To get an Express.Router Object */
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Test Route');
});

module.exports = router;