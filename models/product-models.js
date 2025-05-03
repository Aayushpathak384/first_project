const mongoose  = require('mongoose');
const { type } = require('os');
const { buffer } = require('stream/consumers');
//mongoose.connect(`mongodb://localhost:27017/first_project`);
const productSchema = mongoose.Schema({
    image:Buffer,
      
    name:String,
    description: String,

    price:Number,
    discountedPrice:{
        type:Number,
        default:0,
    },
    quantity:{
        type:Number,
        default:1,
    }
    
});

module.exports = mongoose.model( "product", productSchema);