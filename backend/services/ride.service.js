const rideModel = require('../models/ride.model.js');
const { sendMessageToSocketId } = require('../socket.js');
const { getDistanceAndTime } = require('./Maps.service');
const crypto = require('crypto');

const getOtp = async (num)=>{
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return otp;
}

const getFair= async (origin, destination)=>{

    if(!origin || !destination)
        throw new Error("Invalid request. Please provide pickup and destination addresses.");

    const response = await getDistanceAndTime(origin, destination);

    const baseFare ={
        auto:30,
        car:50,
        moto:20
    }
    
    const perKmRate ={
        auto:10,
        car:15,
        moto:8
    }

    const perMinuteRate ={
        auto:2,
        car:3,
        moto:1.5
    }

    const fare = {
        auto: Math.round(baseFare.auto + ((response.length / 1000) * perKmRate.auto) + ((response.duration / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((response.length / 1000) * perKmRate.car) + ((response.duration / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((response.length / 1000) * perKmRate.moto) + ((response.duration / 60) * perMinuteRate.moto))
    };

    return fare;
}

const createRideService = async ({user, origin, destination, vehicleType}) => {
    if(!user ||!origin ||!destination ||!vehicleType)
        throw new Error("Invalid request. Please provide user, pickup, destination, and vehicle type.");

    const fare = await getFair(origin, destination);
    
    const ride = await rideModel.create({
        user,
        origin,
        destination,
        otp: await getOtp(6),
        fare: fare[vehicleType]
    })
    
    return ride;
}

const confirmRideService = async({rideId, captain})=>{
    if(!rideId ||!captain)
        throw new Error("Invalid request. Please provide rideId and captainId.");
    
    await rideModel.findByIdAndUpdate({_id: rideId}, {captain:captain._id, status:'Accepted'}, {new:true});

    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');
    
    if(!ride)
        throw new Error("Ride not found.");
    
    return ride;
}

const startRideService = async ({rideId, otp, captain})=>{
    if(!rideId ||!otp ||!captain)
        throw new Error("Invalid request. Please provide rideId, otp and captainId.");
    
    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp');
    
    if(!ride)
        throw new Error("Invalid OTP or ride not found or already started.");

    if(ride.status!=='Accepted')
    
    if(ride.otp!== otp)
        throw new Error("Invalid OTP.");
    
    await rideModel.findByIdAndUpdate({_id: rideId}, {status:'Ongoing'});
    
    return ride;
}

const finishRideService = async ({rideId})=>{
    if(!rideId )
        throw new Error("Invalid request. Please provide rideId and captainId.");
    
    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain');
    
    if(!ride)
        throw new Error("Ride not found or already finished.");
    
    if(ride.status!=='Ongoing')
        throw new Error("Ride is not in ongoing state.");
    
    await rideModel.findByIdAndUpdate({_id: rideId}, {status:'Finished'});
    
    return ride;
}
module.exports = {createRideService, getFair, getOtp, confirmRideService, startRideService, finishRideService};