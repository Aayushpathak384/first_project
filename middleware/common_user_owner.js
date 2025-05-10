const jwt = require('jsonwebtoken');
const userModel = require('../models/user-models');
const ownerModel = require('../models/owner-models');


module.exports = async function (req , res , next){
    if (!req.cookies?.token) {
        //req.flash("error", "You need to login first");
        return res.redirect('/users/login');
    }
     try {
           const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
           const user = await userModel.findOne({ email: decoded.email }).select("-password");
           const owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
        
          

           if (!user && !owner) {
              // req.flash("error", "You need to login first");
              
               return res.redirect('/users/login');
           }
           if(user)
           req.user = user;
           else(owner)
           req.owner = owner;
           
           next();
            
        
  
       } catch (error) {
           //req.flash("error", "You need to login first");
           return res.redirect('/users/login');
       }
     

}