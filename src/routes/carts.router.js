const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();
const cartManager = new CartManager();

// POST: Crear un nuevo carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

// GET: Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    res.json(cart);
});

// POST: Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const result = await cartManager.addProductToCart(cartId, productId);

    if (!result) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    } else if (result === 'Producto no encontrado') {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(result);
});

module.exports = router;
