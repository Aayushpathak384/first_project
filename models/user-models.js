const mongoose  = require('mongoose');
const { type } = require('os');
const { buffer } = require('stream/consumers');
//mongoose.connect(`mongodb://localhost:27017/first_project`);
const userSchema = mongoose.Schema({
    full_name:{
        type:String,
        
    },
    username:String,
    email:String,
    password:String,
    Image: {
        type: Buffer,
       
    },
    cart:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:"product",
    }],
    
    order:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
    pata:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "address",
    }]
});

module.exports = mongoose.model( "user" , userSchema);