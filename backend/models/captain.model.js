const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const captainSchema = mongoose.Schema({
    fullName:{
        firstName:{
            type: String,
            required: true,
            minlength: 3
        },
        lastName:{
            type: String,
            minlength: 3
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'inactive'
    },
    vehicle:{
        color:{
            type: String,
            required: true
        },
        plate:{
            type: String,
            required: true
        },
        capacity:{
            type: Number,
            required: true,
            min: 1
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car', 'moto', 'auto']
        }
    },
    location:{
        ltd:{
            type: Number
        },
        lng:{
            type: Number
        }
    },
    socketId:{
        type:String
    }
})

captainSchema.methods.generateToken= function(){
    return jwt.sign(
        {
            _id:this._id
        }, 
        process.env.SECRET_JWT, 
        {
            expiresIn: '24h'
        });
}

captainSchema.methods.comparePassword= function(password){
    return bcrypt.compareSync(password, this.password)
}

captainSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

const Captain = mongoose.model("captain", captainSchema)

module.exports = Captain