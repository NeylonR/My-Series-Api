const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userSeriesListController = require('../controllers/userSeriesList');

module.exports = router;