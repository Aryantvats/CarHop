const express = require('express');
const { verifyJwt } = require('../middleware/auth.middleware.js');
const { getCoordinates, getDistanceTime, getAutoSuggestions } = require('../controllers/maps.controller.js');

const router = express.Router();

router.get('/get-coordinates',verifyJwt, getCoordinates);
router.get('/get-distance-time',verifyJwt, getDistanceTime);
router.get('/get-suggestions', verifyJwt, getAutoSuggestions)

module.exports = router;