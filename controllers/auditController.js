import { db } from "../config/supabase.js";

// GET /api/audit-logs
export const getAuditLogs = (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = db.auditLogs.slice(0, parseInt(limit));
    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching audit logs", error: error.message });
  }
};
