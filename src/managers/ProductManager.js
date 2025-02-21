const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../data/products.json");
  }

  //TODOS
  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return []; // si no existe, retorna un array vacío.
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data) || []; // asegurar que se devuelva un array
  } catch (error) {
      console.error('Error al leer los productos:', error);
      return []; // si hya un  error, retorna array vacío
  }
  }

  // POR ID
  async getProductById(id) {
    const products = await this.getProducts(); // Obtener los productos
    if (!Array.isArray(products)) {
      console.error("Error: La base de datos de productos no es un array");
      return null;
    }
    return products.find((product) => product.id === id) || null;
  }
  // Método para agregar un nuevo producto
  async addProduct({
    title,
    description,
    code,
    price,
    status = true,
    quantity,
    category,
    thumbnails = [],
  }) {
    const products = await this.getProducts();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1, // Genera un ID único
      title,
      description,
      code,
      price,
      status,
      quantity,
      category,
      thumbnails,
    };

    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  //ACTUALIZAR
  async updateProduct(id, updatedFields) {
    let products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...updatedFields };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  //ELIMINAR
  async deleteProduct(id) {
    let products = await this.getProducts();
    const newProducts = products.filter((p) => p.id !== id);

    if (products.length === newProducts.length) return null;

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(newProducts, null, 2)
    );
    return true;
  }
}

module.exports = ProductManager;
