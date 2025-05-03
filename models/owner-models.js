const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    fullname: {
        type: String,
    },
    username:String,
    email: String,
    password: String,
    Image:Buffer,
    product: {
        type: Array,
        default: [],
    },
    contact: Number,
    picture: String,
    gstin: String,
});

module.exports = mongoose.model("owner", ownerSchema);

