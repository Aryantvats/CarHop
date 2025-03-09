const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const blacklistToken = require('../models/tokenBlacklist.model');
const captainModel = require('../models/captain.model.js');

const verifyJwt = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');   
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const isBlacklist = await blacklistToken.findOne({token})

    if(isBlacklist) {
        return res.status(401).json({ msg: 'Token is blacklisted, authorization denied' });
    }

    try {
        
        const decoded =  jwt.verify(token, process.env.SECRET_JWT);
        
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ msg: 'Token is invalid, authorization denied' });
        }
        
        req.user = user;

        return next();

    } catch (error) {
        return res.status(401).json({ msg: 'Token is invalid, authorization denied' });        
    }
}

const captainAuth = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace("Bearer ","");

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const isBlacklist = await blacklistToken.findOne({token});

    if(isBlacklist) {
        return res.status(401).json({ msg: 'Token is blacklisted, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);        

        if(!decoded)
            return res.status(401).json({ msg: 'Token is invalid, authorization denied' });        
        
        const captain = await captainModel.findById(decoded._id);
        
        
        if(!captain)
            return res.status(401).json({ msg: 'Token is invalid, authorization denied' });
        
        req.captain = captain;

        return next();
    }catch (error){
        return res.status(401).json({ msg: 'Token is invalid, authorization denied' });
    }
}

module.exports = {verifyJwt, captainAuth};