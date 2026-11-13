# SwiftStock — Full Stack Intelligent Commerce & Inventory System

**Live demo:** [swiftstock-xrj9.onrender.com](https://swiftstock-xrj9.onrender.com)
*(hosted on Render's free tier, so the first load can take 20–30 seconds while the server wakes up)*

> **Code Campus International | Full Stack Innovation Project 2026**
> **Category 02:** Digital Economy, Commerce & Business Systems
> **Author:** Medugu Wali · [github.com/WaliMedugu](https://github.com/WaliMedugu) · [linkedin.com/in/meduguwali](https://www.linkedin.com/in/meduguwali)

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## Quick Start

```bash
git clone https://github.com/WaliMedugu/swiftstock.git
cd swiftstock
npm install
npm start          # or: npm run dev  (auto-restarts on file changes)
```

Then open **http://localhost:5050** and sign in with one of the [demo accounts](#demo-login-accounts).

The app runs without any configuration: if no Supabase credentials are set, it uses the built-in in-memory store seeded from `data/initialData.js`. See [Configuration](#configuration) to connect a database.

---

## 1. Project Idea & Problem Statement

### The Real-World Problem
Small-to-medium retail and digital commerce businesses struggle with disjointed workflows between sales channels, stock tracking, and financial analytics. Manual inventory updates lead to stockouts, lost sales, unrecorded transactions, and zero audit accountability.

### The Solution: SwiftStock
**SwiftStock** is an end-to-end full stack inventory and order management system built for strict business workflows. It automates inventory deduction upon checkout, provides role-based access control (RBAC), surfaces real-time revenue analytics, and logs every sensitive transaction to an audit trail.

---

## 2. Core Features

### Full Stack Workflow
```
Register / Login → Authenticate (JWT) → Manage Products / Process Orders → Automatic Stock Deduction → Audit Logging → Analytics Calculation
```

### Feature Set
1. **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` (full access & deletions), `Manager` (inventory & order creation), and `Staff` (point-of-sale / order placement).
2. **Real-time Analytics Dashboard**: Live metrics for revenue, fulfilled orders, total units in stock, low-stock alerts, and category sales breakdowns.
3. **Automated Stock Deduction & Thresholds**: Placing orders validates stock levels in real time and automatically updates statuses (`In Stock`, `Low Stock`, `Out of Stock`).
4. **Security Audit Trail / Activity Logging**: Tracks user actions (`USER_LOGIN`, `PRODUCT_CREATED`, `ORDER_CREATED`, `PRODUCT_DELETED`) with IP address and timestamps.
5. **CSV Data Export**: Instant reporting for inventory listings and sales order books.
6. **Multi-Criteria Search & Filtering**: Search by name/SKU/customer and filter by category and stock level.

---

## 3. System Architecture & Tech Stack

### Tech Stack
- **Backend**: Node.js, Express.js (ES Modules), RESTful API architecture
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), password hashing with `bcryptjs`
- **Database & Storage**: PostgreSQL / Supabase, relational modeling, in-memory state sync
- **Frontend**: Vanilla HTML5, CSS design system (dark mode, glassmorphism), modular JavaScript client
- **Security & Middleware**: Custom request logger, RBAC authorization guards, payload validation, CORS
- **Deployment**: Render (`render.yaml`)

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

### Project Structure
```
swiftstock/
├── server.js          # Express entry point, static frontend + API routes
├── config/            # Supabase client and in-memory store
├── controllers/       # auth, products, orders, analytics, audit logic
├── routes/            # REST route definitions
├── middleware/        # JWT auth / RBAC, request logger, validation
├── data/              # Seed data (users, categories, products, orders)
├── public/            # Single-page frontend (HTML, CSS, JS)
├── migration.sql      # PostgreSQL schema
└── render.yaml        # Render deployment config
```

---

## 4. Database Schema Design

The relational database schema is located in [`migration.sql`](migration.sql).

### Entity-Relationship Summary
- **`users`**: User identities, bcrypt password hashes, and roles (`admin`, `manager`, `staff`).
- **`categories`**: Product taxonomy.
- **`products`**: Inventory records with SKU, pricing, cost, stock quantity, alert thresholds, and statuses.
- **`orders`**: Customer transactions, payment methods, and totals.
- **`order_items`**: Junction table linking orders to specific products with quantities and subtotals.
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

### System
- `GET /api/health` — Health check

---

## 6. Running Locally

### Prerequisites
- Node.js (v18+)

### Installation & Startup
```bash
git clone https://github.com/WaliMedugu/swiftstock.git
cd swiftstock
npm install

# Start the server
npm start

# Or with live reloading
npm run dev
```

Open your browser at **http://localhost:5050**.

### Configuration
Optional environment variables (place them in a `.env` file, which is git-ignored):

| Variable | Purpose |
| :--- | :--- |
| `PORT` | Server port (default `5050`) |
| `JWT_SECRET` | Secret used to sign JWTs |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |

Without the Supabase variables, the server runs entirely on the in-memory store.

### Demo Login Accounts
- **Admin**: `admin@swiftstock.com` / `admin123`
- **Manager**: `manager@swiftstock.com` / `manager123`
- **Staff**: `staff@swiftstock.com` / `staff123`

---

## Author

**Medugu Wali** · [github.com/WaliMedugu](https://github.com/WaliMedugu) · [linkedin.com/in/meduguwali](https://www.linkedin.com/in/meduguwali)
