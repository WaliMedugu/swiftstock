# SwiftStock — Project Defense Cheat Sheet & Code Map
> **For Wali Medugu | Zero-Prep Project Defense Guide**  
> Use this quick guide to answer any question your instructor asks and immediately jump to the exact line of code.

---

## 1. Quick 30-Second Elevator Pitch (Memorize or Read)
> *"My project is **SwiftStock**, built under Category 2: Digital Economy & Business Systems. It is a full-stack inventory and order management system. It solves the real-world problem of stockouts and inventory mismatch by automating real-time stock deduction upon order checkout. It features JWT authentication with Role-Based Access Control, a PostgreSQL/Supabase database schema, real-time analytics, and a full activity audit ledger."*

---

## 2. Cheat Sheet: "Where is X in your code?"

| Instructor Question | What File to Open | Exact Function / Code to Point At |
|---|---|---|
| **"Where is your server entry point?"** | [`server.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/server.js) | `app.listen(PORT, ...)` & `app.use('/api/...', ...)` |
| **"Where do you hash passwords?"** | [`controllers/authController.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/controllers/authController.js) | `bcrypt.hash(password, 10)` in `registerUser` |
| **"Where do you create and sign JWT tokens?"** | [`controllers/authController.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/controllers/authController.js) | `jwt.sign({ id, name, email, role }, secretKey)` in `loginUser` |
| **"Where is your JWT verification middleware?"** | [`middleware/auth.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/middleware/auth.js) | `verifyToken` function |
| **"How does Role-Based Access Control (RBAC) work?"** | [`middleware/auth.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/middleware/auth.js) | `requireRoles('admin', 'manager')` middleware |
| **"Where is your request logger middleware?"** | [`middleware/logger.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/middleware/logger.js) | `loggerMiddleware` recording method, route, time |
| **"Where is input validation handled?"** | [`middleware/validation.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/middleware/validation.js) | `validateRegister`, `validateProduct`, `validateOrder` |
| **"Show me your database schema & relationships"** | [`migration.sql`](file:///c:/Code/Lessons/DatabaseJS/finalproject/migration.sql) | Tables: `users`, `products`, `orders`, `order_items` |
| **"Where does automatic stock deduction happen?"** | [`controllers/orderController.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/controllers/orderController.js) | Inside `createOrder` (`product.stock_quantity -= qty`) |
| **"How do you compute stock status (In/Low/Out of Stock)?"** | [`controllers/productController.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/controllers/productController.js) | `computedStatus` check against `min_stock_alert` |
| **"Where are analytics and revenue calculated?"** | [`controllers/analyticsController.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/controllers/analyticsController.js) | `getDashboardMetrics` reducing total revenue and stock |
| **"How is the frontend talking to the backend?"** | [`public/js/app.js`](file:///c:/Code/Lessons/DatabaseJS/finalproject/public/js/app.js) | `fetch('/api/...')` with `Bearer ${authToken}` |

---

## 3. Step-by-Step Live Demo Flow (What to click in class)

1. **Step 1: Sign In**
   - Click the **"Admin"** quick-access pill on the login screen, then click **"Enter Portal"**.
   - *Tell instructor:* "We authenticate via `POST /api/auth/login`, which returns a secure JWT token stored in localStorage."

2. **Step 2: Show Dashboard & Live Analytics**
   - Point out the 4 KPI cards (Gross Revenue, Completed Orders, Catalog Products, Stock Warnings).
   - *Tell instructor:* "The analytics endpoint dynamically computes total sales, inventory valuation, and category distribution."

3. **Step 3: Inventory Management & Search/Filter**
   - Click **"Inventory & Catalog"** on the sidebar.
   - Type `"MacBook"` in the search bar to demonstrate real-time search.
   - Change the category dropdown to `"Office Furniture"`.
   - Click the **Edit** icon on an item, modify the price, and save.

4. **Step 4: Create Order & Watch Stock Deduct**
   - Click **"Record Sale"** (or "+ New Order").
   - Enter a client name (e.g., `Acme Corp`).
   - Select `MacBook Pro M3` (Notice it says *18 available*). Set quantity to `2`.
   - Click **"Commit Sale & Deduct Stock"**.
   - Notice: The order is placed, revenue updates, and `MacBook Pro M3` stock immediately drops to *16 units*.

5. **Step 5: Prove Role-Based Access Control (RBAC)**
   - Click the logout icon at the bottom of the sidebar.
   - Click the **"Staff"** quick-access pill (`staff@swiftstock.com`).
   - *Show instructor:* The **Audit Ledger** menu is hidden, and the **Delete** button on products is disabled for Staff.

6. **Step 6: Show Audit Ledger & CSV Export**
   - Log back in as Admin.
   - Click **"Audit Ledger"** to show every action recorded with timestamp and IP.
   - Click **"Export CSV"** in the top bar to download an instant spreadsheet.

---

## 4. Answers to Common Technical Questions

### Q: "Why did you use Express Routers instead of putting everything in one file?"
> **Answer:** *"Separation of Concerns. By organizing routes into `/routes` and logic into `/controllers`, the codebase is modular, clean, testable, and scalable, exactly as taught in our architecture lessons."*

### Q: "How does your JWT authentication protect routes?"
> **Answer:** *"The client sends the token in the `Authorization: Bearer <token>` header. Our `verifyToken` middleware decodes and verifies the signature using `jwt.verify()`. If valid, it attaches the decoded user and role to `req.user` and calls `next()`."*

### Q: "What database does this use?"
> **Answer:** *"It uses a relational PostgreSQL / Supabase schema defined in `migration.sql` with foreign keys connecting orders to users and order items to products, with an in-memory synchronized store for local resilience."*
