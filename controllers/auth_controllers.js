const userModel = require('../models/user-models');
const productModel = require('../models/product-models');
const addressModel = require('../models/address-model');
const jwt  = require('jsonwebtoken');
const { generate_token } = require('../utils/generate_tokens');
const ownerModel = require('../models/owner-models');

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const ownerModels = require('../models/owner-models');


module.exports.register_user = async function(req, res) {
    try {
        let { email, username, full_name, password } = req.body;
        
        // Check if user exists
        const check_user = await userModel.findOne({
            $or: [{username } , {email}]
    });
        if (check_user) {
            return res.status(400).send("Username has been taken");
        }

        // Hash password and create user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const user = await userModel.create({
            full_name, 
            email, 
            username,
            password: hash,
        });

        // Generate token after user is created
        const token = generate_token(user);
        res.cookie("token", token);
        
        res.redirect("/users/profile");

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error creating user");
    }
}
module.exports.login_user = async function (req, res) {
    try {
        let { email, username, password } = req.body;

        // Find user by either username or email
        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) return res.send("Incorrect username or email");

        bcrypt.compare(password, user.password, function(err, result) {
            if (err) return res.status(500).send("Error comparing passwords");
            if (!result) return res.send("Incorrect password");

            const token = generate_token(user);
            res.cookie("token", token);
            res.redirect("/users/profile");
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
};

module.exports.logout_user = function (req, res) {
    // If using cookies to store JWT
    res.clearCookie("token"); // use the actual cookie name if different

    // Redirect to login
    res.redirect("/users/login");
};


module.exports.logout_owner = async function (req, res) {
   res.clearCookie("token");
   res.redirect("/users/login");
};

module.exports.create_owner = async function (req, res) {
    try {
        const check_owner = await ownerModels.find();
         
        if (check_owner.length > 0) {
            return res.status(403).send("You don't have permission to create an owner.");
        }

        const { fullname,username , email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const created_owner = await ownerModels.create({
            fullname,
            username,
            email,
            password: hashedPassword,
        });
        const token = generate_token(created_owner);
         res.cookie("token" , token);
        res.redirect("/");
    } catch (err) {
        console.error("Error creating owner:", err);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.login_owner = async function(req, res) {
    try {
        let { username , email, password } = req.body;  // use 'login' instead of separate username/email

        // Find by either username or email
        const owner = await ownerModels.findOne({
            $or: [{ username: username }, { email: email}]
        });

        if (!owner) return res.send("Incorrect username or email");

        bcrypt.compare(password, owner.password, function(err, result) {
            if (err) return res.status(500).send("Error comparing passwords");
            if (!result) return res.send("Incorrect password");

            const token = generate_token(owner);
            res.cookie("token", token);
            
            res.redirect("/owners");
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal server error");
    }
};


module.exports.profile_user = async function(req , res){
    try {
        const user = await userModel.findOne({email:req.user.email});
        if(!user) return res.status(404).send("User not found");
        const product = await productModel.find({_id:{$in:user.cart}});
        const address = await addressModel.find({_id:{$in:user.pata}});
        res.render("profile_user" , {
            user,
            product,
            addresses:address[0],
        })
    } catch (error) {
        console.log(error.message);
    }
};

module.exports.profile_pic = async function(req , res){
     try {
            const user = await userModel.findOne({email:req.user.email});
            if(!user) return res.status(404).send("User not found");
            res.render("user_profile_update" , {user})
        } catch (error) {
            console.log(error.message);
        }
}

module.exports.update_profile_pic =async function(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const user = await userModel.findOne({ email: req.user.email });
        if (!user) return res.status(404).send("User not found");

        user.Image = req.file.buffer;
        await user.save();

        res.redirect("/users/profile"); // Make sure this matches your profile route
    } catch (error) {
        console.log(error.message);
        res.status(500).render("user_profile_update", { 
            user: req.user, 
            error: error.message 
        });
    }
}

module.exports.owner_profile_pic = async function(req , res){
    try {
           const owner = await ownerModel.findOne({email:req.owner.email});
           if(!owner) return res.status(404).send("Owner not found");
           res.render("Owner_profile_pic" , {owner})
       } catch (error) {
           console.log(error.message);
       }
}

// Owner Profile Pic Update (Fixed)
module.exports.owner_update_profile_pic = async function(req, res) {
    try {
        if (!req.file) return res.status(400).send("No file uploaded");

        const owner = await ownerModel.findOne({ email: req.owner.email });
        if (!owner) return res.status(404).send("Owner not found");

        owner.Image = req.file.buffer;
        await owner.save(); // Fixed: Changed `user.save()` to `owner.save()`

        res.redirect("/owners/profile");
    } catch (err) {
        console.error(err);
        res.status(500).render("Owner_profile_pic", { 
            owner: req.owner, 
            error: "Failed to update profile picture" 
        });
    }
};