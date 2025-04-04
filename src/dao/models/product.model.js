import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },     // Nombre    
  description: { type: String },               // Descripció
  price: { type: Number, required: true },    // Precio 
  stock: { type: Number, required: true },    // Stock
  category: { type: String },                  // Categoría
  createdAt: { type: Date, default: Date.now },// Fecha de creación 
  updatedAt: { type: Date, default: Date.now }  // Fecha de actualización
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;