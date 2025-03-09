const dotenv = require('dotenv');
dotenv.config();

const cookieparser = require('cookie-parser')

const userRoutes = require('./routes/user.routes.js');
const captainRoutes = require('./routes/captain.routes.js')
const mapRoutes = require('./routes/maps.routes.js')
const rideRoutes = require('./routes/ride.routes.js')
const cors = require('cors');
const express = require('express');
const databaseConnection = require('./db');

databaseConnection()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded(
    {
        extended:true
    }
));
app.use(cookieparser());

app.get('/',(req, res) => {
    res.send("Welcome")
})

app.use('/users', userRoutes);
app.use('/captain',captainRoutes);
app.use('/maps',mapRoutes)
app.use('/ride',rideRoutes)

module.exports = app;