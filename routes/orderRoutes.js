import express from "express";
import { getAllOrders, getOrderById, createOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateOrder } from "../middleware/validation.js";

const router = express.Router();

// Order routes
router.get("/", verifyToken, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.post("/", verifyToken, validateOrder, createOrder);

export default router;
