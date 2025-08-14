const mongose = require('mongoose')
require('dotenv').config();
mongose.connect(process.env.MONGO_URI)
const productscema = mongose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
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
