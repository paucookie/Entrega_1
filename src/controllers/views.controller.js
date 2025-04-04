import { productService } from "../services/products.service.js";
import { cartService } from "../services/carts.service.js";

// Vista de productos con paginación
export const getProductsView = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };
    
    if (sort) {
      options.sort = { price: sort === "desc" ? -1 : 1 };
    }
    
    const filter = {};
    if (query) {
      if (query.includes("category:")) {
        filter.category = query.split(":")[1];
      } else if (query.includes("available:")) {
        filter.status = query.split(":")[1] === "true";
      } else {
        filter.title = { $regex: query, $options: "i" };
      }
    }
    
    const result = await productService.getPaginatedProducts(filter, options);
    
    res.render("index", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit,
      sort,
      query
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).render("error", { message: "Error al cargar los productos" });
  }
};

//Detalle de producto
export const getProductDetailView = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    
    if (!product) {
      return res.status(404).render("error", { message: "Producto no encontrado" });
    }
    
    res.render("product-details", { product });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).render("error", { message: "Error al cargar el producto" });
  }
};

// Vista de carrito
export const getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    
    if (!cart) {
      return res.status(404).render("error", { message: "Carrito no encontrado" });
    }
    
    // Multiplica precio por cantidad
    const multiply = (price, quantity) => (price * quantity).toFixed(2);
    
    // Helper para calcular el total del carrito
    const calculateTotal = (products) => {
      return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0).toFixed(2);
    };
    
    res.render("cart", { 
      cart, 
      helpers: { 
        multiply,
        calculateTotal 
      } 
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).render("error", { message: "Error al cargar el carrito" });
  }
};
