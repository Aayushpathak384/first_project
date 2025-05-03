const express = require('express');
const router = express.Router();
const isloggedin = require('../middleware/isloggedin');
const upload = require('../config/multer_config');
const {
    register_user ,
     login_user,
    logout_user,
    profile_user,
    profile_pic,
    update_profile_pic,
     } = require("../controllers/auth_controllers");
const userModels = require('../models/user-models');
const productModels = require('../models/product-models');
const addressModel = require('../models/address-model');


router.post('/create_user', register_user);
router.post('/login_user' , login_user);

router.get('/register' , function(req ,res){
    res.render("create_user")
})

router.post('/profile/update/pic', upload.single("Image"), isloggedin,update_profile_pic);


router.get('/profile/update' , isloggedin ,profile_pic )

router.get('/profile' ,isloggedin ,profile_user )

router.get('/logout' , logout_user);

router.get('/login' , function(req , res){
    res.render("login_user");
})




module.exports = router;