# SwiftStock — Project Presentation Guide & Defense Script

**Course:** Code Campus International | Full Stack Innovation Project 2026  
**Presenter:** Wali Medugu  
**Product:** SwiftStock (Category 02: Digital Economy, Commerce & Business Systems)

---

## 1. Problem Statement
Many retail and small commerce enterprises face discrepancies between order processing and inventory levels. Without an integrated system, businesses experience overselling, stockout delays, uncoordinated staff operations, and lack of transaction auditing.

## 2. Target Users
- **Store Administrators / Business Owners:** Need macro-level analytics, staff management, and system auditing.
- **Inventory Managers:** Need real-time stock monitoring, replenishment alerts, and product catalog controls.
- **Sales Staff & Cashiers:** Need an intuitive order creation flow that verifies stock availability on the fly.

## 3. Solution
**SwiftStock** is an end-to-end full stack commerce management platform. It unites product catalog management, automatic inventory deduction, real-time analytics, and role-based permissions into a single high-performance dashboard.

## 4. Key Features & Business Workflows
- **Authentication & RBAC:** Secure JWT issuance with Admin, Manager, and Staff roles.
- **Live Inventory Management:** Search, filter, add, edit, and delete products with auto-computed status (`In Stock`, `Low Stock`, `Out of Stock`).
- **Commercial Checkout Engine:** Multi-item sales orders with live price calculations and atomic stock deduction.
- **Executive Analytics:** Live revenue metrics, order tallies, inventory valuation, and category breakdown.
- **Security Audit Logs:** Chronological record of system activities, logins, and modifications.
- **CSV Data Export:** One-click data export for accounting and reports.

## 5. System Design & API Structure
- **Architecture:** Separation of Concerns with Express Routers (`/api/auth`, `/api/products`, `/api/orders`, `/api/analytics`, `/api/audit-logs`) and standalone Controller layers.
- **Middleware Chain:** Global Request Logger -> Body Parsers -> JWT Authentication Verification -> Role Guard Checks -> Input Validation -> Route Handler.

## 6. Tech Stack
- **Backend:** Node.js, Express.js (ES Modules), `cors`, `dotenv`
- **Security:** `bcryptjs` (salt rounds = 10) & `jsonwebtoken` (24h token validity)
- **Database:** PostgreSQL / Supabase with relational schemas (`users`, `categories`, `products`, `orders`, `order_items`, `audit_logs`) + resilient store
- **Frontend:** Responsive UI with custom CSS design tokens, modern dark theme, and asynchronous Fetch API

## 7. Live Demo Walkthrough Steps
1. **Login:** Log in with `admin@swiftstock.com` (`admin123`).
2. **Dashboard Overview:** Show KPI cards (Revenue, Orders, Catalog, Alerts).
3. **Inventory Management:** Filter by category/status, search for "MacBook", edit an item, or add a new product.
4. **Create Order:** Click "Create New Order", select products, watch price calculation, submit order, and observe immediate stock level deduction.
5. **Role Switching:** Log out and log in as `staff@swiftstock.com` (`staff123`) to demonstrate RBAC restriction (Audit log & delete buttons hidden).
6. **Audit Trail & Export:** Return to Admin, inspect the recorded log entries, and export inventory to CSV.

## 8. Technical Challenges Overcome
- **Stock Synchronization:** Handling inventory updates immediately when orders are processed to prevent overselling.
- **Role-Based Guards:** Ensuring non-admin roles cannot execute privileged routes even if called via direct API tools like Postman.

## 9. Lessons Learned & Future Improvements
- **Lessons:** Modular MVC architecture in Express makes testing and scaling APIs straightforward; clean middleware pipelines ensure tight security without duplicate validation code.
- **Future Roadmap:**
  - Automated low-stock email notifications via SendGrid/Resend.
  - Payment gateway integration (Stripe / Paystack webhook processing).
  - Barcode and QR code scanning for physical warehouse management.


You can do this... calm down and breathe.....