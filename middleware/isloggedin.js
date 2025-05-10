const jwt = require('jsonwebtoken');
const userModel = require('../models/user-models');

module.exports = async function (req, res, next) {
    if (!req.cookies?.token) {
        //req.flash("error", "You need to login first");
        return res.redirect('/users/login');
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
           // req.flash("error", "You need to login first");
           
            return res.redirect('/users/login');
        }

        req.user = user;
        next();
    } catch (error) {
        //req.flash("error", "You need to login first");
        return res.redirect('/users/login');
    }
};