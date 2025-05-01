const express = require('express');
const router = express.Router();
const {register_user} = require("../controllers/auth_controllers");


router.post('/create_user', register_user);

router.get('/' , function(req ,res){
    res.render("create_user")
})




module.exports = router;