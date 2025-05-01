const mongoose  = require('mongoose');
const { type } = require('os');
//mongoose.connect(`mongodb://localhost:27017/first_project`);
const userSchema = mongoose.Schema({
    full_name:{
        type:String,
        
    },
    email:String,
    password:String,
    cart:{
       type:Array,
       default:[],
    },
    
    order:{
        type:Array,
        default:[],
    },
    contact:Number,
    picture:String,
});

module.exports = mongoose.model( "user" , userSchema);