import { cartService } from "../services/carts.service.js";

// Obtener carrito con productos p
export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    
    if (!cart) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }
    
    res.json({ status: "success", payload: cart });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// eliminar un producto específico del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.removeProductFromCart(cid, pid);
    
    if (!result) {
      return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
    }
    
    res.json({ status: "success", message: "Producto eliminado del carrito", payload: result });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// Actualizar todo el carrito
export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    // Validar que products sea un array
    if (!Array.isArray(products)) {
      return res.status(400).json({ status: "error", message: "El campo products debe ser un array" });
    }
    
    const result = await cartService.updateCart(cid, products);
    
    if (!result) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }
    
    res.json({ status: "success", message: "Carrito actualizado", payload: result });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// Actualizar cantidad 
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "La cantidad debe ser un número positivo" });
    }
    
    const result = await cartService.updateProductQuantity(cid, pid, quantity);
    
    if (!result) {
      return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
    }
    
    res.json({ status: "success", message: "Cantidad actualizada", payload: result });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};

// Eliminar 
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartService.clearCart(cid);
    
    if (!result) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }
    
    res.json({ status: "success", message: "Carrito vaciado", payload: result });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
};