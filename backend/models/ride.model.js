const mongoose = require('mongoose');

const rideSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain'
    },
    origin:{
        type:String,
        required: true
    },
    destination:{
        type:String,
        required: true
    },
    fare:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'cancelled', 'completed'],
        default: 'pending'
    },
    distance:{
        type: Number
    },
    duration:{
        type: Number
    },
    paymentId:{
        type: String
    },
    orderId:{
        type: String
    },
    otp:{
        type: String,
        select: false,
        required: true
    },
    signature:{
        type: String
    }
})

module.exports = mongoose.model('Ride', rideSchema);