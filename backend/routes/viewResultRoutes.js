const express = require('express');
const { viewResult, viewAllResult } = require('../controllers/viewResultController');
const router = express.Router();

router.post('/view-result', viewResult);
router.post('/view-result-all', viewAllResult);

module.exports = router;