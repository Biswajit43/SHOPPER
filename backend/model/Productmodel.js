const mongose = require('mongoose')
require('dotenv').config();
mongose.connect(process.env.MONGO_URI)
const productscema = mongose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    catagory: {
        type: String,
        require: true
    },
    new_price: {
        type: Number,
        require: true
    },
    old_price: {
        type: Number,
        require: true
    },
    date: {
        type: Number,
        default: Date.now(),
    },
    available: {
        type: Boolean,
        default: true,
    }
})
module.exports = mongose.model("product", productscema);