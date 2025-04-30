const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/first_project`)
.then(function(done){
    console.log("database connected");
})
.catch(function(err){
    console.log(err);
})
module.exports = mongoose.connection;