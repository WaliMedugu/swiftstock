import { db, supabase } from "../config/supabase.js";

// GET /api/orders
export const getAllOrders = (req, res) => {
  try {
    const { search, payment_status, sortBy = "created_at", order = "desc" } = req.query;
    let results = [...db.orders];

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (o) => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || (o.customer_email && o.customer_email.toLowerCase().includes(q))
      );
    }

    if (payment_status && payment_status !== "all") {
      results = results.filter((o) => o.payment_status.toLowerCase() === payment_status.toLowerCase());
    }

    results.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (valA < valB) return order === "desc" ? 1 : -1;
      if (valA > valB) return order === "desc" ? -1 : 1;
      return 0;
    });

    return res.status(200).json({ success: true, count: results.length, orders: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// GET /api/orders/:id
export const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = db.orders.find((o) => o.id == id || o.order_number === id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  return res.status(200).json({ success: true, order });
};

// POST /api/orders (Checkout & create order)
export const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, payment_method = "Card", items } = req.body;

    if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Customer name and at least one item are required." });
    }

    // Validate and calculate totals + deduct stock
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = db.products.find((p) => String(p.id) === String(item.product_id));
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ID ${item.product_id} not found.` });
      }

      const qty = parseInt(item.quantity) || 1;
      if (product.stock_quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.stock_quantity}, Requested: ${qty}`
        });
      }

      // Deduct stock atomically
      product.stock_quantity -= qty;
      if (product.stock_quantity === 0) product.status = "Out of Stock";
      else if (product.stock_quantity <= (product.min_stock_alert || 5)) product.status = "Low Stock";

      const subtotal = product.price * qty;
      totalAmount += subtotal;

      processedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        unit_price: product.price,
        subtotal
      });
    }

    const newOrder = {
      id: db.orders.length ? Math.max(...db.orders.map((o) => o.id)) + 1 : 1,
      order_number: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: customer_name.trim(),
      customer_email: customer_email ? customer_email.trim() : null,
      total_amount: parseFloat(totalAmount.toFixed(2)),
      payment_method,
      payment_status: "Paid",
      items: processedItems,
      created_by: req.user?.id || 1,
      created_by_name: req.user?.name || "Staff",
      created_at: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // If Supabase is connected, attempt safe sync without crashing
    if (supabase) {
      try {
        supabase.from("orders").insert([{
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          total_amount: newOrder.total_amount,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          created_by: newOrder.created_by
        }]).then(() => {}).catch(() => {});
      } catch (e) {
        // Safe failover
      }
    }

    try {
      db.addAuditLog(req.user?.id || 1, req.user?.name || "Staff", "ORDER_CREATED", `Processed order ${newOrder.order_number} for ${newOrder.customer_name} ($${newOrder.total_amount})`);
    } catch (e) {
      console.warn("Audit log note:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({ success: false, message: error.message || "Error creating order" });
  }
};
