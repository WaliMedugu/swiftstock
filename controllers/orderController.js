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
export const createOrder = (req, res) => {
  try {
    const { customer_name, customer_email, payment_method = "Card", items } = req.body;

    // Validate and calculate totals + deduct stock
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = db.products.find((p) => p.id == item.product_id);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ID ${item.product_id} not found.` });
      }

      const qty = parseInt(item.quantity);
      if (product.stock_quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.stock_quantity}, Requested: ${qty}`
        });
      }

      // Deduct stock
      product.stock_quantity -= qty;
      if (product.stock_quantity === 0) product.status = "Out of Stock";
      else if (product.stock_quantity <= product.min_stock_alert) product.status = "Low Stock";

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
      created_by_name: req.user?.name || "System",
      created_at: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    if (supabase) {
      supabase.from("orders").insert([newOrder]).catch((e) => console.warn("Supabase order sync:", e.message));
    }

    db.addAuditLog(req.user?.id, req.user?.name, "ORDER_CREATED", `Processed order ${newOrder.order_number} for ${newOrder.customer_name} ($${newOrder.total_amount})`);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating order", error: error.message });
  }
};
