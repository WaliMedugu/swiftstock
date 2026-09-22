import { db, supabase } from "../config/supabase.js";

// GET /api/products (With search, filter, sort, pagination)
export const getAllProducts = (req, res) => {
  try {
    let { search, category, status, sortBy, order = "asc", page = 1, limit = 50 } = req.query;

    let results = [...db.products];

    // Filter by search term
    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (category && category !== "all") {
      results = results.filter((p) => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by stock status
    if (status && status !== "all") {
      results = results.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }

    // Sort
    if (sortBy) {
      results.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return order === "desc" ? 1 : -1;
        if (valA > valB) return order === "desc" ? -1 : 1;
        return 0;
      });
    }

    const total = results.length;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = results.slice(startIndex, startIndex + limitNum);

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products: paginated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

// GET /api/products/:id
export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = db.products.find((p) => p.id == id || p.sku === id);

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  return res.status(200).json({ success: true, product });
};

// POST /api/products (Admin & Manager only)
export const createProduct = (req, res) => {
  try {
    const { name, category, price, cost_price = 0, stock_quantity = 0, min_stock_alert = 5, image_url } = req.body;

    const skuPrefix = category ? category.substring(0, 2).toUpperCase() : "GN";
    const generatedSku = `PRD-${skuPrefix}-${Math.floor(100 + Math.random() * 900)}`;

    const qty = parseInt(stock_quantity) || 0;
    let computedStatus = "In Stock";
    if (qty === 0) computedStatus = "Out of Stock";
    else if (qty <= (parseInt(min_stock_alert) || 5)) computedStatus = "Low Stock";

    const newProduct = {
      id: db.products.length ? Math.max(...db.products.map((p) => p.id)) + 1 : 1,
      sku: req.body.sku || generatedSku,
      name: name.trim(),
      category: category || "General",
      category_id: 1,
      price: parseFloat(price),
      cost_price: parseFloat(cost_price) || 0,
      stock_quantity: qty,
      min_stock_alert: parseInt(min_stock_alert) || 5,
      status: computedStatus,
      image_url: image_url || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.products.unshift(newProduct);

    if (supabase) {
      supabase.from("products").insert([newProduct]).catch((e) => console.warn("Supabase product sync:", e.message));
    }

    db.addAuditLog(req.user?.id, req.user?.name, "PRODUCT_CREATED", `Added product '${newProduct.name}' (${newProduct.sku})`);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};

// PUT /api/products/:id (Admin & Manager only)
export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id == id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const { name, category, price, cost_price, stock_quantity, min_stock_alert, image_url } = req.body;

    const current = db.products[index];
    const newQty = stock_quantity !== undefined ? parseInt(stock_quantity) : current.stock_quantity;
    const newMinAlert = min_stock_alert !== undefined ? parseInt(min_stock_alert) : current.min_stock_alert;

    let computedStatus = "In Stock";
    if (newQty === 0) computedStatus = "Out of Stock";
    else if (newQty <= newMinAlert) computedStatus = "Low Stock";

    const updated = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      category: category !== undefined ? category : current.category,
      price: price !== undefined ? parseFloat(price) : current.price,
      cost_price: cost_price !== undefined ? parseFloat(cost_price) : current.cost_price,
      stock_quantity: newQty,
      min_stock_alert: newMinAlert,
      status: computedStatus,
      image_url: image_url !== undefined ? image_url : current.image_url,
      updated_at: new Date().toISOString()
    };

    db.products[index] = updated;

    db.addAuditLog(req.user?.id, req.user?.name, "PRODUCT_UPDATED", `Updated product '${updated.name}' (${updated.sku})`);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating product", error: error.message });
  }
};

// DELETE /api/products/:id (Admin only)
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const index = db.products.findIndex((p) => p.id == id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const [deleted] = db.products.splice(index, 1);

    db.addAuditLog(req.user?.id, req.user?.name, "PRODUCT_DELETED", `Deleted product '${deleted.name}' (${deleted.sku})`);

    return res.status(200).json({
      success: true,
      message: `Product '${deleted.name}' was successfully removed.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting product", error: error.message });
  }
};
