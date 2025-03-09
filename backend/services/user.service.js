const User = require('../models/user.model.js');

const createUser = async ({firstName,lastName,email,password}) => {
    if(!firstName || !email || !password)
        throw new Error('All fields are required');

    const existingUser = await User.findOne({email});
    if(existingUser)
        throw new Error('Email already exists');

    const user = await User.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password
    })
    
    return user;
}

module.exports = { createUser };