const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

//home
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

//realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});
module.exports = router;