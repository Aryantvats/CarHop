const mongoose = require('mongoose')

const blacklistTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
})

const blacklistToken = mongoose.model('blacklistToken', blacklistTokenSchema)

module.exports = blacklistToken