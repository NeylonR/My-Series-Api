const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userSeriesListController = require('../controllers/userSeriesList');

router.post('/:id', auth, userSeriesListController.addToList);
router.post('', auth, userSeriesListController.getUserList);
router.put('/:id', auth, userSeriesListController.editList);
router.delete('/:id', auth, userSeriesListController.deleteFromList);

module.exports = router;