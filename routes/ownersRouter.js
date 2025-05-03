const express  = require('express');
const router = express();
const ownerModels = require('../models/owner-models');
const productModel = require('../models/product-models');
 const upload = require('../config/multer_config');
const isloggedin_owner = require('../middleware/isloggedin_owner');

const {
    create_owner,
    login_owner,
    logout_owner,
    owner_profile_pic,
    owner_update_profile_pic,
      } = require('../controllers/auth_controllers');
const isloggedin = require('../middleware/isloggedin');
const userModels = require('../models/user-models');

if (process.env.NODE_ENV === "development") {
    router.post('/create', create_owner);
} else {
    // Optionally log for production or perform a different action
    console.log('Not in development mode. Route creation skipped.');
}


router.post('/admin/login' , login_owner);

router.get('/login', function(req, res) {
    res.render("login_owner");
});

router.get('/logout' , logout_owner);
router.get('/admin/create' , function(req  , res){
      res.render("create_owner");
})

router.get('/',isloggedin_owner ,async function(req ,res){
    const products = await productModel.find();
    res.render("create_product" , {products});
})

router.get('/profile' , isloggedin_owner,async function (req ,res) {
    try {
        const owner = await ownerModels.findOne({email:req.owner.email});
        if(!owner) return res.status(404).send("owner not found");
               
               res.render("owner_profile" , {
                  owner
               })
    } catch (error) {
        console.log(error.message)
    }
   
})

router.post('/profile/update/pic', upload.single("Image"), isloggedin_owner,owner_update_profile_pic);


router.get('/profile/update' , isloggedin_owner ,owner_profile_pic )

router.get('/all_users', isloggedin_owner, async function(req, res) {
    try {
        const users = await userModels.find().exec(); // Add await and .exec()
        res.render("owners_all_users", { 
            users: users // Make sure to pass as an object
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error loading user data");
    }
});


module.exports = router;