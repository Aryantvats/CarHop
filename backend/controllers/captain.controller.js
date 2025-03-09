const captainService = require('../services/captain.service');
const { validationResult }= require('express-validator')
const captainModel = require('../models/captain.model');
const blacklistToken = require('../models/tokenBlacklist.model');

const handleCaptainRegistered = async (req, res, next)=>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {        
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, password, vehicle } = req.body;
        
        const existingCaptain = await captainModel.findOne({email})

        if(existingCaptain)
            return res.status(400).json({ msg: 'Email already exists' });        
        
        const captain = await captainService.createCaptain({ 
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email, 
            password, 
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });        

        const token = await captain.generateToken();

        res.status(201).json({token, captain });
    }catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

const handlecaptainLogin = async (req, res) => {
     const error = validationResult(req);

     if (!error.isEmpty()) {
         return res.status(400).json({ errors: error.array() });
     }

     const { email, password } = req.body;

     const captain = await captainModel.findOne({ email}).select('+password');

     if(!captain || !(await captain.comparePassword(password))){
         return res.status(400).json({ msg: 'Invalid credentials' });
     }

     const token = await captain.generateToken();

     res.status(200)
     .cookie("token", token)     
     .json({ token, captain });
}

const captainProfile = async (req, res) => {
    res.status(200).json(req.captain);
}

const captainLogout = async (req, res) => {

    res.clearCookie('token');

    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ","");

    await blacklistToken.create({ token });

    res.status(200).json({ msg: "Logged out" });
}

module.exports = {handleCaptainRegistered, handlecaptainLogin, captainProfile, captainLogout};