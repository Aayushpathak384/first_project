require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'first_project' // Specify database name here
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  
  // Start your server after successful connection
  
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  
});


module.exports = mongoose.connection;
