const userModel = require('../models/user-models');
const jwt  = require('jsonwebtoken');
const { generate_token } = require('../utils/generate_tokens');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

module.exports.register_user = async function(req, res) {
    try {
        let { email, username, fullname, password } = req.body;
        
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
            fullname, 
            email, 
            username,
            password: hash,
        });

        // Generate token after user is created
        const token = generate_token(user);
        res.cookie("token", token);
        
        // Send success response
        return res.status(201).json({
            message: "User created successfully",
            user,
            token
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Error creating user");
    }
}