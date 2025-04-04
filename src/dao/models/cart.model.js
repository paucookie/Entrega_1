import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Referencia modelo de productos
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

// Middleware paralos productos automáticamente
cartSchema.pre('findOne', function() {
  this.populate('products.product');
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;