const mongoose = require('mongoose');

const databaseConnection=()=>{

mongoose.connect(process.env.DB_URL)
.then(()=>console.log("Connected to database"))
.catch(err=>console.log('Failed to connect to MongoDB', err))
}

module.exports=databaseConnection;