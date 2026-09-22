# SwiftStock — Full Stack Intelligent Commerce & Inventory System

> **Code Campus International | Full Stack Innovation Project 2026**  
> **Category 02:** Digital Economy, Commerce & Business Systems  
> **Author:** Wali Medugu

---

## 1. Project Idea & Problem Statement

### The Real-World Problem
Small-to-medium retail and digital commerce businesses struggle with disjointed workflows between sales channels, stock tracking, and financial analytics. Manual inventory updates lead to stockouts, lost sales, unrecorded transactions, and zero audit accountability.

### The Solution: SwiftStock
**SwiftStock** is an end-to-end full stack inventory and order management system built for high performance and strict business workflows. It automates inventory deduction upon checkout, provides role-based access control (RBAC), surfaces real-time revenue analytics, and logs every sensitive transaction to a secure audit trail.

---

## 2. Core Features & Advanced Requirements

### Full Stack Workflow
$$\text{Register / Login} \longrightarrow \text{Authenticate (JWT)} \longrightarrow \text{Manage Products / Process Orders} \longrightarrow \text{Automatic Stock Deduction} \longrightarrow \text{Audit Logging} \longrightarrow \text{Analytics Calculation}$$

### Advanced Feature Implementation (Exceeding 3 required)
1. **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` (Full access & deletions), `Manager` (Inventory & Order creation), and `Staff` (Point-of-Sale / Order placement).
2. **Real-time Analytics Dashboard**: Live metrics for revenue, fulfilled orders, total units in stock, low-stock alerts, and category sales breakdowns.
3. **Automated Stock Deduction & Thresholds**: Placing orders validates stock levels in real time and automatically updates statuses (`In Stock`, `Low Stock`, `Out of Stock`).
4. **Security Audit Trail / Activity Logging**: Tracks user actions (`USER_LOGIN`, `PRODUCT_CREATED`, `ORDER_CREATED`, `PRODUCT_DELETED`) with IP address and timestamps.
5. **CSV Data Export**: Instant reporting for inventory listings and sales order books.
6. **Multi-Criteria Search & Filtering**: Fast search by name/SKU/customer and filtering by category and stock level.

---

## 3. System Architecture & Tech Stack

### Tech Stack
- **Backend**: Node.js, Express.js (ES Modules), RESTful API Architecture
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Password Hashing with `bcryptjs`
- **Database & Storage**: PostgreSQL / Supabase, Relational modeling, In-memory state sync
- **Frontend**: Vanilla HTML5, Modern CSS Design System (Dark Mode, Glassmorphism), Modular JavaScript Client
- **Security & Middleware**: Custom Request Logger, RBAC Authorization guards, Strict Payload Validation, CORS

### Architecture Flow
```
[Client SPA (Browser)] 
       │
       ▼ (HTTP / JSON + Bearer Token)
[Express Server (PORT 5050)]
       │
   ├── [Logger Middleware] 
   ├── [JWT Auth & RBAC Middleware]
   ├── [Input Validation Middleware]
   └── [Modular Controllers & Routers]
              │
              ▼
   [PostgreSQL / Supabase Database + In-Memory Resilient Store]
```

---

## 4. Database Schema Design

The relational database schema is located in [`migration.sql`](file:///c:/Code/Lessons/DatabaseJS/finalproject/migration.sql).

### Entity-Relationship Summary:
- **`users`**: User identities, bcrypt password hashes, and roles (`admin`, `manager`, `staff`).
- **`categories`**: Product taxonomy.
- **`products`**: Inventory records with SKU, pricing, cost, stock quantity, alert thresholds, and statuses.
- **`orders`**: Customer transactions, payment methods, and totals.
- **`order_items`**: Relational junction table linking orders to specific products with quantities and subtotals.
- **`audit_logs`**: System security and operational logs.

---

## 5. API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated session
- `GET /api/auth/users` — Get all users (Admin/Manager only)

### Products & Inventory
- `GET /api/products` — List products with search, category, status filters
- `GET /api/products/:id` — Retrieve single product by ID or SKU
- `POST /api/products` — Create new product (Admin/Manager)
- `PUT /api/products/:id` — Update product details (Admin/Manager)
- `DELETE /api/products/:id` — Delete product (Admin only)

### Sales Orders
- `GET /api/orders` — List orders with customer search and status filters
- `GET /api/orders/:id` — Get order invoice details
- `POST /api/orders` — Place order and trigger inventory stock deduction

### Analytics & Audit
- `GET /api/analytics/dashboard` — Revenue, counts, valuation, and category breakdown
- `GET /api/audit-logs` — Activity trail (Admin/Manager only)

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18+)

### Installation & Startup
```bash
# 1. Navigate to finalproject directory
cd c:\Code\Lessons\DatabaseJS\finalproject

# 2. Start the server
npm start

# Or with live reloading
npm run dev
```

### Accessing the Web Application
Open your browser and navigate to: **`http://localhost:5050`**

### Demo Login Accounts
- **Admin**: `admin@swiftstock.com` / `admin123`
- **Manager**: `manager@swiftstock.com` / `manager123`
- **Staff**: `staff@swiftstock.com` / `staff123`
