const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const handlebars = require("express-handlebars");
const path = require("path");
const productRoutes = require('./routes/products.router.js');
const cartRoutes = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const ProductManager = require('./managers/ProductManager');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const productManager = new ProductManager();          

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', viewsRouter);

//Socket.io
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Se manda lista de productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit('products', products);
    
    //NewProduct
    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
    });
    
    //DeleteProduct
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getProducts();
        io.emit('products', updatedProducts);
    });
});

// Se config  io para que sea accesible en las rutas
app.set('io', io);


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
