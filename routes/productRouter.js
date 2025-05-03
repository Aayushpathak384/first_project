const express = require('express');
const router = express.Router();
const upload = require('../config/multer_config');
const productModels = require('../models/product-models');

// Create a new product (with image upload)
router.post('/create', upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, discountedPrice } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const product = await productModels.create({
            name,
            price,
            discountedPrice,
            description,
            image: req.file.buffer, // Directly assign buffer
        });

        console.log("Product created:", product);
        res.redirect("/owners"); // Ensure this route exists
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ error: "Failed to create product" }); // Better error handling
    }
});

// Get all products (placeholder)
router.get('/products', (req, res) => {
    res.send("Everything is working");
});

module.exports = router;