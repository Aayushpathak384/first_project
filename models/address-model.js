const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
     street:String,
     pincode:Number,
     localtiy:String,
     state:String,
     country:String,
     payment:String,
     date:{
        type:Date,
        default:Date.now,
     }
     
})

module.exports = mongoose.model("address" , addressSchema);