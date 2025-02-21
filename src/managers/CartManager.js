const fs = require("fs");
const path = require("path");
const ProductManager = require("./ProductManager");

class CartManager {
carts = [];
constructor() {
    this.path = path.join(__dirname, "../data/carts.json");
    this.productManager = new ProductManager();
}

  // TODOS LOS CARTS
async getCarts() {
    try {
    if (!fs.existsSync(this.path)) return [];
    const data = await fs.promises.readFile(this.path, {encoding: "utf-8"});
    return JSON.parse(data); 
    } catch (error) {
    console.error("Error al leer Carts:", error);
    return [];
    }
}

  //  CART X ID
async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === id) || null;
}

  // CART NUEVO
async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length ? carts[carts.length - 1].id + 1 : 1, //genera un ID único
    products: [],
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
}

  // AGREGAR CART
async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) return null;

    const product = await this.productManager.getProductById(productId);
    if (!product) return "Producto no encontrado";

    const productIndex = cart.products.findIndex(
    (p) => p.product === productId
    );

    if (productIndex !== -1) {
      // si producto ya está en el carrito, aumenta la cantidad
    cart.products[productIndex].quantity += 1;
    } else {
      // Agregar el producto al carrito
    cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
}
}

module.exports = CartManager;
