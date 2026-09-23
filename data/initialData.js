import bcrypt from "bcryptjs";

// Initial seed data for users, products, orders, categories, and audit logs
export const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@swiftstock.com",
    password_hash: bcrypt.hashSync("admin123", 10),
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: "Manager Wali",
    email: "manager@swiftstock.com",
    password_hash: bcrypt.hashSync("manager123", 10),
    role: "manager",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: "Staff Harry",
    email: "staff@swiftstock.com",
    password_hash: bcrypt.hashSync("staff123", 10),
    role: "staff",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialCategories = [
  { id: 1, name: "Electronics", description: "Laptops, monitors, and gadgets" },
  { id: 2, name: "Office Furniture", description: "Desks, chairs, and ergonomic accessories" },
  { id: 3, name: "Accessories", description: "Cables, chargers, and adapters" },
  { id: 4, name: "Networking", description: "Routers, switches, and patch cords" }
];

export const initialProducts = [
  {
    id: 1,
    sku: "PRD-EL-001",
    name: "MacBook Pro M3 14-Inch",
    category: "Electronics",
    category_id: 1,
    price: 1599.00,
    cost_price: 1250.00,
    stock_quantity: 18,
    min_stock_alert: 5,
    status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    sku: "PRD-EL-002",
    name: "Dell UltraSharp 27\" 4K Monitor",
    category: "Electronics",
    category_id: 1,
    price: 549.99,
    cost_price: 410.00,
    stock_quantity: 4,
    min_stock_alert: 6,
    status: "Low Stock",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    sku: "PRD-FN-001",
    name: "Ergonomic Mesh Office Chair",
    category: "Office Furniture",
    category_id: 2,
    price: 289.50,
    cost_price: 190.00,
    stock_quantity: 12,
    min_stock_alert: 4,
    status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1580481077197-285642a845ea?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    sku: "PRD-AC-001",
    name: "Thunderbolt 4 Multi-Port Dock",
    category: "Accessories",
    category_id: 3,
    price: 149.00,
    cost_price: 85.00,
    stock_quantity: 0,
    min_stock_alert: 5,
    status: "Out of Stock",
    image_url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    sku: "PRD-NW-001",
    name: "Enterprise WiFi 6 Mesh Router",
    category: "Networking",
    category_id: 4,
    price: 229.00,
    cost_price: 160.00,
    stock_quantity: 9,
    min_stock_alert: 3,
    status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    sku: "PRD-AC-002",
    name: "Wireless Mechanical Keyboard",
    category: "Accessories",
    category_id: 3,
    price: 119.99,
    cost_price: 65.00,
    stock_quantity: 25,
    min_stock_alert: 5,
    status: "In Stock",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const initialOrders = [
  {
    id: 1,
    order_number: "ORD-2026-1001",
    customer_name: "Apex Tech Corp",
    customer_email: "orders@apextech.io",
    total_amount: 3198.00,
    payment_method: "Transfer",
    payment_status: "Paid",
    items: [
      { product_id: 1, product_name: "MacBook Pro M3 14-Inch", quantity: 2, unit_price: 1599.00, subtotal: 3198.00 }
    ],
    created_by: 1,
    created_by_name: "Admin User",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    order_number: "ORD-2026-1002",
    customer_name: "Greenfield Media",
    customer_email: "accounts@greenfield.com",
    total_amount: 958.49,
    payment_method: "Card",
    payment_status: "Paid",
    items: [
      { product_id: 2, product_name: "Dell UltraSharp 27\" 4K Monitor", quantity: 1, unit_price: 549.99, subtotal: 549.99 },
      { product_id: 3, product_name: "Ergonomic Mesh Office Chair", quantity: 1, unit_price: 289.50, subtotal: 289.50 },
      { product_id: 6, product_name: "Wireless Mechanical Keyboard", quantity: 1, unit_price: 119.00, subtotal: 119.00 }
    ],
    created_by: 2,
    created_by_name: "Manager Alex",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    order_number: "ORD-2026-1003",
    customer_name: "Nova Workspace Ltd",
    customer_email: "billing@novaspace.co",
    total_amount: 458.00,
    payment_method: "Online",
    payment_status: "Paid",
    items: [
      { product_id: 5, product_name: "Enterprise WiFi 6 Mesh Router", quantity: 2, unit_price: 229.00, subtotal: 458.00 }
    ],
    created_by: 3,
    created_by_name: "Staff Sarah",
    created_at: new Date().toISOString()
  }
];

export const initialAuditLogs = [
  {
    id: 1,
    user_id: 1,
    user_name: "Admin User",
    action: "SYSTEM_INIT",
    details: "Initialized SwiftStock database and security configurations",
    ip_address: "127.0.0.1",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 2,
    user_name: "Manager Alex",
    action: "PRODUCT_CREATED",
    details: "Added product 'MacBook Pro M3 14-Inch' (PRD-EL-001)",
    ip_address: "127.0.0.1",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    user_id: 1,
    user_name: "Admin User",
    action: "ORDER_CREATED",
    details: "Generated order #ORD-2026-1001 for Apex Tech Corp ($3,198.00)",
    ip_address: "127.0.0.1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];
