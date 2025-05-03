const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-models');

module.exports = async function (req, res, next) {
    if (!req.cookies?.token) {
        return res.redirect('/owners/login');
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
        
        if (!owner) {
            return res.redirect('/owners/login');
        }

        req.owner = owner;
        next();
    } catch (error) {
        return res.redirect('/owners/login');
    }
};