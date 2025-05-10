require('dotenv').config();
const mongoose = require('mongoose');

// Add connection options for better practice
mongoose.connect(`${process.env.MONGODB_URI}/first_project`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database connected"))
.catch(err => console.error(err));

module.exports = mongoose.connection;
