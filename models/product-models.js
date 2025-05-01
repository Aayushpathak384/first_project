const mongoose  = require('mongoose');
const { type } = require('os');
//mongoose.connect(`mongodb://localhost:27017/first_project`);
const productSchema = mongoose.Schema({
    image:String,
    name:String,
    price:Number,
    discount:{
        type:Number,
        default:0,
    },
    bgcolout:String,
    panalcolour:String,
    textcolour:String,
});

module.exports = mongoose.model( "product", productSchema);