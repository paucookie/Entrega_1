import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";

const router = Router();

// Rutas que ya existentes
router.get("/:cid", cartController.getCartById);
router.post("/", cartController.createCart);
router.post("/:cid/product/:pid", cartController.addProductToCart);

// Nuevos endpoints
router.delete("/:cid/products/:pid", cartController.deleteProductFromCart);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.clearCart);

export default router;