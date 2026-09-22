import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { initialUsers, initialCategories, initialProducts, initialOrders, initialAuditLogs } from "../data/initialData.js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.PROJECT_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.ANON_KEY;

export let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn("Supabase client init warning, using memory store:", error.message);
  }
}

// In-Memory Database Store (High-reliability fallback & fast runtime)
export const db = {
  users: [...initialUsers],
  categories: [...initialCategories],
  products: [...initialProducts],
  orders: [...initialOrders],
  auditLogs: [...initialAuditLogs],

  addAuditLog(userId, userName, action, details, ip = "127.0.0.1") {
    const log = {
      id: this.auditLogs.length + 1,
      user_id: userId || null,
      user_name: userName || "System",
      action,
      details,
      ip_address: ip,
      created_at: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    return log;
  }
};
