const mongoose = require('mongoose');
const config = require('config')
const debug = require("debug")("development:mongoose")

mongoose.connect(`${config.get("MONGODB_URI")}/first_project`)
.then(function(done){
    debug("database connected");
})
.catch(function(err){
    console.log(err);
})
module.exports = mongoose.connection;