const express = require('express')
const captainRouter = express.Router();
const {body} = require('express-validator');
const {handleCaptainRegistered, handlecaptainLogin, captainProfile, captainLogout} = require('../controllers/captain.controller');
const { captainAuth } = require('../middleware/auth.middleware');

captainRouter.post('/register',[
    body('fullName.firstName').isLength({ min: 3 }).withMessage('FirstName must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 8 }).withMessage('Plate must be at least 8 characters long'),
    body('vehicle.capacity').isLength({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
], handleCaptainRegistered)

captainRouter.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
],
handlecaptainLogin)

captainRouter.get('/profile',captainAuth, captainProfile)

captainRouter.get('/logout', captainAuth, captainLogout)


module.exports = captainRouter;