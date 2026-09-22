import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";
import { verifyToken, requireRoles } from "../middleware/auth.js";
import { validateProduct } from "../middleware/validation.js";

const router = express.Router();

// Public / Authenticated read
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected writes
router.post("/", verifyToken, requireRoles("admin", "manager"), validateProduct, createProduct);
router.put("/:id", verifyToken, requireRoles("admin", "manager"), updateProduct);
router.delete("/:id", verifyToken, requireRoles("admin"), deleteProduct);

export default router;
