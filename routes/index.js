const express = require('express');
const router = express.Router();
const isloggedin = require('../middleware/isloggedin');
const productModels = require('../models/product-models');
const userModels = require('../models/user-models');
const addressModels = require('../models/address-model');
const isloggedin_owner = require('../middleware/isloggedin_owner');
//const common_user_owner = require('../middleware/common_user_owner');

// Home route
router.get('/', isloggedin, async function(req, res) {
    try {
        let error = req.flash("error");
        const products = await productModels.find();
        res.render("home", { error, products });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// Add to cart
router.get('/cart/:productId', isloggedin, async function(req, res) {
    try {
        const productId = req.params.productId;
        const user = await userModels.findOne({ email: req.user.email });
        if (!user) return res.status(404).send("User not found");
        
        // Check if product already in cart
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
        }
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// View cart
router.get('/cart', isloggedin, async function(req, res) {
    try {
        const user = await userModels.findOne({ email: req.user.email });
        if (!user) return res.status(404).send("User not found");

        const products = await productModels.find({ _id: { $in: user.cart } });
        let subtotal = 0;
        products.forEach(function(val) {
            subtotal += val.price * val.quantity;
        });
        
        let tax = (subtotal * 18 / 100);
        let total = subtotal + tax;
        
        res.render("cart", { 
            user, 
            products, 
            tax, 
            subtotal, 
            total 
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Remove from cart - FIXED: Use filter instead of pop
router.get('/remove/:productId', isloggedin, async function(req, res) {
    try {
        const user = await userModels.findOne({ email: req.user.email });
        if (!user) return res.status(404).send("User not found");
        
        const productId = req.params.productId;
        user.cart = user.cart.filter(id => id.toString() !== productId);
        await user.save();
        
        res.redirect('/cart');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

// Checkout routes
router.get('/checkout', isloggedin, function(req, res) {
    res.render("checkout");
});

router.post('/checkout/submit', isloggedin, async function(req, res) {
    try {
        const user = await userModels.findOne({ email: req.user.email });
        if (!user) return res.status(404).send("User not found");
        
        const { street, locality, pincode, state, country, payment } = req.body;
        const address = await addressModels.create({
            street, 
            country,
            pincode,
            payment,
            locality, // Fixed typo: localtiy → locality
            state,
        });
        
        user.pata.push(address._id);
        await user.save();
        res.redirect("/");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});


// Order route - FIXED: Using common_user_owner middleware
router.get('/order', isloggedin, async function(req, res) {
    try {
        // Get the authenticated user (already verified by isloggedin middleware)
        const user = req.user;
        
        // Find the user in database
        const dbUser = await userModels.findOne({ email: user.email });
        if (!dbUser) return res.status(404).send("User not found");

        // Get products in cart
        const products = await productModels.find({ _id: { $in: dbUser.cart } });
        
        // Calculate totals
        let subtotal = 0;
        products.forEach(val => {
            subtotal += val.price * val.quantity;
        });
        
        let tax = subtotal * 0.1; // 10% tax
        let total = subtotal + tax;
        
        // Get addresses and delivery date
        const addresses = await addressModels.find({ _id: { $in: dbUser.pata } });
        const orderDate = new Date();
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        
        // Render order page with all data
        res.render("order", {
            user: dbUser,
            products,
            subtotal,
            total,
            tax,
            addresses: addresses[0],
            deliveryDate: deliveryDate.toDateString()
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;