// import express from "express"
const express = require("express"); 
const productRoutes = require('./routes/products.router.js')
const cartRoutes = require('./routes/carts.router.js')

const app = express();// puede ser tambien server
const PORT = 8080; // se desigan el puerto

app.use(express.json());
app.use('/api/products', productRoutes)
app.use('/api/carts', cartRoutes)


// se pone a escuchar la peticion en el puerto 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
