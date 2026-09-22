import express from "express";
import { registerUser, loginUser, getCurrentUser, getAllUsers } from "../controllers/authController.js";
import { verifyToken, requireRoles } from "../middleware/auth.js";
import { validateRegister } from "../middleware/validation.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", verifyToken, getCurrentUser);
router.get("/users", verifyToken, requireRoles("admin", "manager"), getAllUsers);

export default router;
