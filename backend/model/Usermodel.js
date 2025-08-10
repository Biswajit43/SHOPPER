
const mongose = require('mongoose')
require('dotenv').config();
mongose.connect(process.env.MONGO_URI)
const userscema = mongose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartdata: {
        type: Object,
        default: {}
    },
    date: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongose.model("user", userscema);