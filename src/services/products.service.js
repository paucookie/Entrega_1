import Product from "../dao/models/product.model.js";

class ProductService {
  // Método para paginación
  async getPaginatedProducts(filter = {}, options = {}) {
    try {
      const result = await Product.paginate(filter, options);
      return result;
    } catch (error) {
      throw new Error("Error al obtener productos paginados: " + error.message);
    }
  }
  
  
}

export const productService = new ProductService();