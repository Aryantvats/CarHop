const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;
const initialiseSocket = (server)=>{

    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    
    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);
        
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });

        socket.on('join', async (data)=>{

            const {userId, userType} = data;

            if(userType === 'user'){
                await userModel.findByIdAndUpdate(
                    userId,
                {
                    socketId: socket.id
                })
}
            else if(userType === 'captain'){
                await captainModel.findByIdAndUpdate(
                    userId,
                {
                    socketId: socket.id
                })
            }
        })

        socket.on('update-location-captain', async (data)=>{

            const {userId, location} = data;

            if(!location || !location.ltd || !location.lng){
                return socket.emit('error', {message:'Invalid location'});
            }

            await captainModel.findByIdAndUpdate(
                userId,
                {
                    location:{
                        ltd: location.ltd,
                        lng: location.lng
                    }
                })
    })
})
}

const sendMessageToSocketId = (socketId, messageObject)=>{

    console.log(`Sending message to ${socketId}:`, messageObject);
    if(io)
    io.to(socketId).emit(messageObject.event , messageObject.data);
    else
    console.log('Socket not initialised');
}

module.exports = {initialiseSocket, sendMessageToSocketId};