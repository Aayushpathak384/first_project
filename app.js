const express  = require('express');
const app = express();
const path = require('path');
const cookies = require('cookie-parser');
//require("dotenv").config();
 const flash = require('connect-flash');
// const expressSession = require('express-session');


const db = require('./config/mongoose-connect');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productRouter');
const ownerRouter = require('./routes/ownersRouter');
const indexRouter = require('./routes/index');

app.use(cookies());
const expressSession = require('express-session');
require('dotenv').config(); // make sure this is before using process.env

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET, // or hardcode a string just for testing
}));




app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , "public")));


app.use("/users" , usersRouter);
app.use("/owners" , ownerRouter);
app.use("/products" , productsRouter);
app.use("/" , indexRouter);



app.listen(3000 , function(err){
    if(err)
        console.log(err);
    else
    console.log("server chal raha hai");
})