import { db } from "../config/supabase.js";

// GET /api/analytics/dashboard
export const getDashboardMetrics = (req, res) => {
  try {
    const totalProducts = db.products.length;
    const totalStock = db.products.reduce((acc, p) => acc + p.stock_quantity, 0);
    const lowStockCount = db.products.filter((p) => p.status === "Low Stock").length;
    const outOfStockCount = db.products.filter((p) => p.status === "Out of Stock").length;

    const totalOrders = db.orders.length;
    const totalRevenue = db.orders.reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);
    const inventoryValuation = db.products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);

    // Sales by Category
    const categorySales = {};
    for (const order of db.orders) {
      for (const item of order.items || []) {
        const prod = db.products.find((p) => p.id === item.product_id);
        const cat = prod?.category || "General";
        categorySales[cat] = (categorySales[cat] || 0) + (item.subtotal || 0);
      }
    }

    // Recent 5 orders
    const recentOrders = db.orders.slice(0, 5);

    return res.status(200).json({
      success: true,
      metrics: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
        inventoryValuation: parseFloat(inventoryValuation.toFixed(2))
      },
      categorySales,
      recentOrders
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error compiling analytics", error: error.message });
  }
};
