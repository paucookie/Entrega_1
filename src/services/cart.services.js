import Cart from "../dao/models/cart.model.js";

class CartService {
  async getCartById(cartId) {
    try {
      return await Cart.findById(cartId).populate('products.product');
    } catch (error) {
      throw new Error("Error al obtener carrito: " + error.message);
    }
  }
  
  async removeProductFromCart(cartId, productId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito: " + error.message);
    }
  }
  
  async updateCart(cartId, products) {
    try {
      // Validar que cada producto tenga product y quantity
      const validProducts = products.map(item => ({
        product: item.product,
        quantity: item.quantity || 1
      }));
      
      return await Cart.findByIdAndUpdate(
        cartId,
        { products: validProducts },
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw new Error("Error al actualizar carrito: " + error.message);
    }
  }
  
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) return null;
      
      // Buscar si el producto ya existe en el carrito
      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );
      
      if (productIndex === -1) return null;
      
      // Actualizar la cantidad
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      
      return await cart.populate('products.product');
    } catch (error) {
      throw new Error("Error al actualizar cantidad: " + error.message);
    }
  }
  
  async clearCart(cartId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
    } catch (error) {
      throw new Error("Error al vaciar carrito: " + error.message);
    }
  }
}

export const cartService = new CartService();