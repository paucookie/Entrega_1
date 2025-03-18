const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

// Ruta para la vista home
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

// Ruta para la vista realTimeProducts
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Para la integración de HTTP con WebSockets (opcional)
router.post('/products', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        // Obtener la instancia de io y emitir el evento
        const io = req.app.get('io');
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const result = await productManager.deleteProduct(parseInt(req.params.id));
        if (!result) return res.status(404).json({ message: "Producto no encontrado" });
        
        // Obtener la instancia de io y emitir el evento
        const io = req.app.get('io');
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
        
        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;