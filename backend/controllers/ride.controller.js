const {validationResult} = require('express-validator')
const {getFair, createRideService, confirmRideService, startRideService, finishRideService} = require('../services/ride.service')
const { getCaptainInTheRadius, getAddressCoordinate } = require('../services/Maps.service')
const { sendMessageToSocketId } = require('../socket')
const rideModel = require('../models/ride.model')

const createRide = async (req, res) =>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { origin, destination, vehicleType} =req.body;

    try{
        const ride = await createRideService({user: req.user._id, origin, destination, vehicleType});
        res.status(200).json(ride);

        const originCoor = await getAddressCoordinate(origin);     

        const captainInRadius = await getCaptainInTheRadius(originCoor.ltd, originCoor.lng, 2);  
        
        console.log(captainInRadius);
        

        ride.otp=""

        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user')

        captainInRadius.map(async (captain) =>{
            sendMessageToSocketId(captain.socketId, {event: 'new-ride', data: rideWithUser})
        })
    }catch(err){
        return res.status(500).json({message: 'Internal server error'})
    }
}

const getTripFare = async (req, res) =>{

    const {origin, destination} = req.query;
    try {
        const fare = await getFair(origin, destination)
        res.status(200).json(fare);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

const confirmRide = async (req, res) =>{
    const {rideId, captain} = req.body;

    try {
        const ride = await confirmRideService({rideId, captain});

        sendMessageToSocketId(ride.user.socketId,{
            event: 'ride-confirmed',
            data: ride
        })

        res.status(200).json({message: 'Ride confirmed'});
        
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

const startRide = async (req, res) =>{
    const {rideId, otp} = req.query;
    try{
        const ride = await startRideService({rideId, otp, captain: req.captain});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        res.status(200).json(ride);
    }catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

const finishRide = async (req, res) =>{
    const {rideId} = req.query;

    try {
        const ride = await finishRideService({rideId});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-finished',
            data: ride
        })

        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}
module.exports = {createRide, getTripFare, confirmRide, startRide, finishRide};