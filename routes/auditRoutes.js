import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { verifyToken, requireRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, requireRoles("admin", "manager"), getAuditLogs);

export default router;
