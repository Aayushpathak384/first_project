const mongoose  = require('mongoose');
const { type } = require('os');

const ownerSchema = mongoose.Schema({
    full_name:{
        type:String,
        
    },
    email:String,
    password:String,
    
    product:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
    gstin:String,
});

module.exports = mongoose.model({ownerSchema} , "owner");