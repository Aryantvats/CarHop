const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength: 3
        },
        lastName:{
            type:String,
            minlength: 3
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        select:false
    },
    socketId:{
        type:String
    }
})

userSchema.methods.generateAuthToken= function(){
    return jwt.sign(
        {
            _id:this._id
        }, 
        process.env.SECRET_JWT, 
        {
            expiresIn: '24h'
        });
}

userSchema.methods.comparePassword=function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;