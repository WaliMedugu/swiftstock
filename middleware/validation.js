// Validation Middlewares (Taught in class for request sanitization and safety)

export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body || {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Valid name is required." });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "A valid email containing '@' is required." });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
  }

  if (role && !["admin", "manager", "staff"].includes(role.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: "Role must be either 'admin', 'manager', or 'staff'."
    });
  }

  next();
};

export const validateProduct = (req, res, next) => {
  const { name, price, stock_quantity } = req.body || {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Product name is required." });
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ success: false, message: "Product price must be a positive number." });
  }

  if (stock_quantity === undefined || stock_quantity === null || isNaN(Number(stock_quantity)) || Number(stock_quantity) < 0) {
    return res.status(400).json({ success: false, message: "Stock quantity must be a non-negative integer." });
  }

  next();
};

export const validateOrder = (req, res, next) => {
  const { customer_name, items } = req.body || {};

  if (!customer_name || typeof customer_name !== "string" || customer_name.trim() === "") {
    return res.status(400).json({ success: false, message: "Customer name is required." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order must contain at least one item." });
  }

  for (const item of items) {
    if (!item.product_id || !item.quantity || Number(item.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Each order item must specify a valid product_id and positive quantity."
      });
    }
  }

  next();
};
