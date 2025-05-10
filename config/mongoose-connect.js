require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGODB_URI}/first_project`)
.then(() => console.log("Database connected"))
.catch(err => console.error(err));

module.exports = mongoose.connection;
