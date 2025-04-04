import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";

const router = Router();

// Productos con paginación
router.get("/products", viewsController.getProductsView);

// Detalle de producto
router.get("/products/:pid", viewsController.getProductDetailView);

// Ruta de carrito
router.get("/carts/:cid", viewsController.getCartView);

export default router;
