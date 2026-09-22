import express from "express";
import { getDashboardMetrics } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboardMetrics);

export default router;
