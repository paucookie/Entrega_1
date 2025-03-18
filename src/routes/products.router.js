const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();
const productManager = new ProductManager();

//todos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

//Por id
router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(parseInt(req.params.pid));
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
});

//agregar
router.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

//Actualizar
router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(updatedProduct);
});

// DELETE
router.delete('/:pid', async (req, res) => {
    const result = await productManager.deleteProduct(parseInt(req.params.pid));
    if (!result) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado con éxito" });
});

module.exports = router;
