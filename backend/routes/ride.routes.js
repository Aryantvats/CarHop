const express = require('express')
const router = express.Router();
const {body} = require('express-validator');
const { verifyJwt, captainAuth } = require('../middleware/auth.middleware');
const { createRide, getTripFare, confirmRide, startRide, finishRide } = require('../controllers/ride.controller');

router.post('/create',
    verifyJwt,
    body('origin').isString().isLength({min:3}).withMessage("Invalid origin"),
    body('destination').isString().isLength({min:3}).withMessage("Invalid destination"),
    body('vehicleType').isString().isIn(["auto","moto","car"]).withMessage("Invalid vehicle type"),
    createRide
)
router.get('/get-fare',
    verifyJwt,
    getTripFare
)
router.post('/confirm-ride',
    captainAuth,
    confirmRide
)
router.get('/start-ride',
    captainAuth,
    startRide
)
router.get('/finish-ride',
    captainAuth,
    finishRide
)

module.exports = router