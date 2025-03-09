const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { handleRegister, handleLogin, userProfile, handleLogout } = require('../controllers/user.controller');
const {verifyJwt} = require('../middleware/auth.middleware');

router.get('/',(req, res)=>[
    res.json({ message: 'Welcome to the API!' })
])

router.post('/register',[
    body('fullName.firstName').isLength({ min: 3 }).withMessage('FirstName must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], handleRegister)

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], handleLogin)

router.get('/profile',verifyJwt, userProfile)

router.get('/logout',verifyJwt, handleLogout)

module.exports = router;