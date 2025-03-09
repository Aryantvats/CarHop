const blacklistToken = require('../models/tokenBlacklist.model.js');
const User = require('../models/user.model.js');
const userService = require('../services/user.service.js');
const { validationResult } = require('express-validator')

const handleRegister = async (req , res, next)=>{
    try {        

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {fullName, email, password} = req.body;

        const user = await userService.createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName, 
            email, 
            password
        });

        const token = await user.generateAuthToken();

        res
        .status(201)
        .cookie("token", token)
        .json({ user, token });

    }catch (e) {
        console.error(e);
        return res.status(400).json({msg: 'Invalid input data'});
    }
}

const handleLogin = async (req, res, next) => {
    try {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email}).select("+password");

        if(!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = await user.generateAuthToken();
        
        res
        .status(200)
        .cookie("token", token)
        .json({ user, token });

}catch{
    console.error(e);
    return res.status(400).json({ msg: 'Invalid input data' });
}}

const userProfile= async (req, res, next) => {
    res.status(200).json( req.user );
}

const handleLogout = async (req, res, next) => {

    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');   

    await blacklistToken.create({token});

    res.clearCookie("token")

    res.status(200).json({ msg: 'Logged out' });
}

module.exports = { handleRegister, handleLogin, userProfile, handleLogout };