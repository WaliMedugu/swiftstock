// SwiftStock Frontend Client — Anthropic-Inspired Editorial Edition

const API_BASE = "/api";
let currentUser = null;
let authToken = localStorage.getItem("swiftstock_token") || null;
let allProducts = [];
let allOrders = [];

// ========================
// INITIALIZATION
// ========================
document.addEventListener("DOMContentLoaded", () => {
  if (authToken) {
    verifySession();
  } else {
    showAuthView();
  }
});

// Toast notification helper with custom SVGs
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.className = `toast ${type}`;
  
  const iconSvg = type === "success" 
    ? `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--green)" stroke-width="1.5"/><path d="M5 8L7 10L11 6" stroke="var(--green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="var(--rust)" stroke-width="1.5"/><path d="M8 5V9M8 11.5V12" stroke="var(--rust)" stroke-width="1.75" stroke-linecap="round"/></svg>`;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

// ========================
// AUTHENTICATION
// ========================
function switchAuthTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabLoginBtn = document.getElementById("tabLoginBtn");
  const tabRegisterBtn = document.getElementById("tabRegisterBtn");

  if (tab === "login") {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    tabLoginBtn.classList.add("active");
    tabRegisterBtn.classList.remove("active");
  } else {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    tabLoginBtn.classList.remove("active");
    tabRegisterBtn.classList.add("active");
  }
}

function setDemoCredentials(email, pass) {
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = pass;
  showToast(`Loaded ${email} credentials`, "success");
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Authenticating...</span>`;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to log in");

    authToken = data.token;
    localStorage.setItem("swiftstock_token", authToken);
    currentUser = data.user;

    showToast(`Welcome back, ${currentUser.name}!`, "success");
    showMainApp();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Enter Journal</span> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;
  const submitBtn = document.getElementById("regSubmitBtn");

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Registering...</span>`;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");

    authToken = data.token;
    localStorage.setItem("swiftstock_token", authToken);
    currentUser = data.user;

    showToast("Registration successful!", "success");
    showMainApp();
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Complete Registration</span> <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`;
  }
}

async function verifySession() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    if (!res.ok) throw new Error("Session expired");

    const data = await res.json();
    currentUser = data.user;
    showMainApp();
  } catch {
    handleLogout();
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem("swiftstock_token");
  showAuthView();
  showToast("Session closed", "success");
}

function showAuthView() {
  document.getElementById("authView").classList.remove("hidden");
  document.getElementById("mainApp").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("authView").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");

  // Populate user badge
  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userRoleBadge").textContent = currentUser.role;
  document.getElementById("userAvatar").src = currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=C4724A&color=fff`;

  // Apply RBAC UI Rules
  applyRBAC();

  // Load Dashboard by default
  navigateTo("dashboard");
}

function applyRBAC() {
  const role = currentUser.role;
  const auditNav = document.getElementById("auditNavItem");
  const addProdBtn = document.getElementById("addProductBtn");

  if (role === "staff") {
    if (auditNav) auditNav.classList.add("hidden");
    if (addProdBtn) addProdBtn.classList.add("hidden");
  } else {
    if (auditNav) auditNav.classList.remove("hidden");
    if (addProdBtn) addProdBtn.classList.remove("hidden");
  }
}

// ========================
// NAVIGATION & VIEWS
// ========================
function navigateTo(viewName, event) {
  if (event) event.preventDefault();

  document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".view-panel").forEach(el => el.classList.add("hidden"));

  const targetNav = document.querySelector(`.nav-link[href="#${viewName}"]`);
  if (targetNav) targetNav.classList.add("active");

  const topActionBtnText = document.getElementById("topActionBtnText");

  if (viewName === "dashboard") {
    document.getElementById("viewDashboard").classList.remove("hidden");
    topActionBtnText.textContent = "Record Sale";
    loadDashboard();
  } else if (viewName === "products") {
    document.getElementById("viewProducts").classList.remove("hidden");
    topActionBtnText.textContent = currentUser.role === "staff" ? "Record Sale" : "Add Product";
    loadProducts();
  } else if (viewName === "orders") {
    document.getElementById("viewOrders").classList.remove("hidden");
    topActionBtnText.textContent = "Record Sale";
    loadOrders();
  } else if (viewName === "audit") {
    document.getElementById("viewAudit").classList.remove("hidden");
    topActionBtnText.textContent = "Export CSV";
    loadAuditLogs();
  }
}

function handleTopActionClick() {
  const activeNav = document.querySelector(".nav-link.active")?.getAttribute("href");
  if (activeNav === "#products" && currentUser.role !== "staff") {
    openProductModal();
  } else if (activeNav === "#audit") {
    exportCurrentTableToCSV();
  } else {
    openNewOrderModal();
  }
}

// ========================
// DASHBOARD LOGIC
// ========================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/analytics/dashboard`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const { metrics, categorySales, recentOrders } = data;

    // Background preload products for immediate modal availability
    loadProducts();

    // Metrics
    document.getElementById("statRevenue").textContent = `$${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    document.getElementById("statOrders").textContent = metrics.totalOrders;
    document.getElementById("statProducts").textContent = metrics.totalProducts;
    document.getElementById("statStockUnits").textContent = `${metrics.totalStock} units`;
    document.getElementById("statAlerts").textContent = metrics.lowStockCount + metrics.outOfStockCount;

    // Recent orders table
    const tableBody = document.getElementById("recentOrdersTableBody");
    if (recentOrders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-light);font-style:italic;">No transactions recorded yet.</td></tr>`;
    } else {
      tableBody.innerHTML = recentOrders.map(o => `
        <tr>
          <td><code>${o.order_number}</code></td>
          <td><strong>${o.customer_name}</strong></td>
          <td style="font-family:var(--font-mono);font-weight:600;color:var(--terracotta);">$${parseFloat(o.total_amount).toFixed(2)}</td>
          <td><span class="ftag ftag-green">${o.payment_status}</span></td>
          <td style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-light);">${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
      `).join("");
    }

    // Category sales
    const catList = document.getElementById("categorySalesList");
    const categories = Object.keys(categorySales);
    if (categories.length === 0) {
      catList.innerHTML = `<p style="color:var(--text-light);font-size:0.85rem;font-style:italic;">No departmental data available.</p>`;
    } else {
      catList.innerHTML = categories.map(cat => `
        <div class="department-row">
          <span class="dept-name">${cat}</span>
          <span class="dept-amount">$${categorySales[cat].toFixed(2)}</span>
        </div>
      `).join("");
    }
  } catch (err) {
    showToast(`Dashboard: ${err.message}`, "error");
  }
}

// ========================
// PRODUCTS & INVENTORY
// ========================
async function loadProducts() {
  try {
    const search = document.getElementById("productSearch")?.value || "";
    const category = document.getElementById("categoryFilter")?.value || "all";
    const status = document.getElementById("statusFilter")?.value || "all";

    let url = `${API_BASE}/products?search=${encodeURIComponent(search)}&category=${category}&status=${status}`;

    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    allProducts = data.products;
    renderProductsTable(allProducts);
  } catch (err) {
    showToast(`Error fetching catalog: ${err.message}`, "error");
  }
}

function handleProductSearch() {
  loadProducts();
}

function renderProductsTable(products) {
  const tbody = document.getElementById("productsTableBody");
  if (!products || products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-light);font-style:italic;">No catalog entries match your query.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    let badgeClass = "ftag-green";
    if (p.status === "Low Stock") badgeClass = "ftag-terra";
    else if (p.status === "Out of Stock") badgeClass = "ftag-rust";

    const canEdit = currentUser.role === "admin" || currentUser.role === "manager";
    const canDelete = currentUser.role === "admin";

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${p.image_url}" alt="${p.name}" style="width:34px;height:34px;border-radius:var(--r);object-fit:cover;border:1px solid var(--sand);">
            <div>
              <strong>${p.name}</strong>
            </div>
          </div>
        </td>
        <td><code>${p.sku}</code></td>
        <td>${p.category || 'General'}</td>
        <td style="font-family:var(--font-mono);font-weight:600;color:var(--text);">$${parseFloat(p.price).toFixed(2)}</td>
        <td style="font-family:var(--font-mono);">${p.stock_quantity} units</td>
        <td><span class="ftag ${badgeClass}">${p.status}</span></td>
        <td>
          <div style="display:flex;gap:6px;">
            ${canEdit ? `<button class="btn btn-sm btn-o" title="Edit Item" onclick="openEditProductModal(${p.id})"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger" title="Remove Item" onclick="handleDeleteProduct(${p.id}, '${p.name}')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 4H13M5 4V2H11V4M6 7V12M10 7V12M4 4L5 14H11L12 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>` : ''}
            ${!canEdit && !canDelete ? `<span class="mono-label" style="font-size:0.6rem;">Read Only</span>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function openProductModal() {
  document.getElementById("productModalTitle").textContent = "Add New Catalog Item";
  document.getElementById("editProductId").value = "";
  document.getElementById("productForm").reset();
  document.getElementById("productModal").classList.remove("hidden");
}

function openEditProductModal(id) {
  const prod = allProducts.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("productModalTitle").textContent = "Edit Catalog Item";
  document.getElementById("editProductId").value = prod.id;
  document.getElementById("prodName").value = prod.name;
  document.getElementById("prodCategory").value = prod.category || "Electronics";
  document.getElementById("prodSku").value = prod.sku;
  document.getElementById("prodPrice").value = prod.price;
  document.getElementById("prodCostPrice").value = prod.cost_price || 0;
  document.getElementById("prodStock").value = prod.stock_quantity;
  document.getElementById("prodMinAlert").value = prod.min_stock_alert;

  document.getElementById("productModal").classList.remove("hidden");
}

function closeProductModal() {
  document.getElementById("productModal").classList.add("hidden");
}

async function handleProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("editProductId").value;
  const isEdit = Boolean(id);

  const payload = {
    name: document.getElementById("prodName").value.trim(),
    category: document.getElementById("prodCategory").value,
    sku: document.getElementById("prodSku").value.trim() || undefined,
    price: parseFloat(document.getElementById("prodPrice").value),
    cost_price: parseFloat(document.getElementById("prodCostPrice").value) || 0,
    stock_quantity: parseInt(document.getElementById("prodStock").value),
    min_stock_alert: parseInt(document.getElementById("prodMinAlert").value) || 5
  };

  const url = isEdit ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
  const method = isEdit ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save product");

    showToast(isEdit ? "Product updated" : "Product cataloged", "success");
    closeProductModal();
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function handleDeleteProduct(id, name) {
  if (!confirm(`Are you sure you want to permanently remove '${name}'?`)) return;

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${authToken}` }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Delete failed");

    showToast(`Removed '${name}'`, "success");
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ========================
// ORDERS & SALES
// ========================
async function loadOrders() {
  try {
    const search = document.getElementById("orderSearch")?.value || "";
    const res = await fetch(`${API_BASE}/orders?search=${encodeURIComponent(search)}`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    allOrders = data.orders;
    renderOrdersTable(allOrders);
  } catch (err) {
    showToast(`Error fetching invoices: ${err.message}`, "error");
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById("ordersTableBody");
  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text-light);font-style:italic;">No transactions recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => {
    const itemsSummary = o.items ? o.items.map(i => `${i.product_name} (x${i.quantity})`).join(", ") : "Items";
    return `
      <tr>
        <td><code>${o.order_number}</code></td>
        <td>
          <div><strong>${o.customer_name}</strong></div>
          <small style="color:var(--text-light);font-family:var(--font-mono);font-size:0.75rem;">${o.customer_email || 'No email'}</small>
        </td>
        <td style="max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-style:italic;">${itemsSummary}</td>
        <td><strong style="color:var(--terracotta);font-family:var(--font-mono);">$${parseFloat(o.total_amount).toFixed(2)}</strong></td>
        <td><span class="ftag ftag-terra">${o.payment_method}</span></td>
        <td>${o.created_by_name || 'Staff'}</td>
        <td style="font-family:var(--font-mono);font-size:0.78rem;color:var(--text-light);">${new Date(o.created_at).toLocaleString()}</td>
      </tr>
    `;
  }).join("");
}

async function openNewOrderModal() {
  document.getElementById("orderForm").reset();
  const container = document.getElementById("orderItemsContainer");
  container.innerHTML = "";
  if (!allProducts || allProducts.length === 0) {
    await loadProducts();
  }
  addOrderItemRow();
  document.getElementById("orderModal").classList.remove("hidden");
  updateOrderTotal();
}

function closeOrderModal() {
  document.getElementById("orderModal").classList.add("hidden");
}

function addOrderItemRow() {
  const container = document.getElementById("orderItemsContainer");
  const rowId = `row_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  const row = document.createElement("div");
  row.className = "order-item-row";
  row.id = rowId;

  const options = allProducts.map(p => `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock_quantity}">${p.name} ($${p.price.toFixed(2)} - ${p.stock_quantity} avail)</option>`).join("");

  row.innerHTML = `
    <select class="order-prod-select" onchange="updateOrderTotal()" required>
      <option value="">-- Choose Item --</option>
      ${options}
    </select>
    <input type="number" class="order-prod-qty" min="1" value="1" oninput="updateOrderTotal()" required placeholder="Qty">
    <span class="order-prod-subtotal" style="font-family:var(--font-mono);font-weight:600;font-size:0.82rem;text-align:right;color:var(--terracotta);">$0.00</span>
    <button type="button" class="btn btn-sm btn-danger" onclick="removeOrderItemRow('${rowId}')"><svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg></button>
  `;

  container.appendChild(row);
}

function removeOrderItemRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    updateOrderTotal();
  }
}

function updateOrderTotal() {
  let total = 0;
  const rows = document.querySelectorAll(".order-item-row");

  rows.forEach(row => {
    const select = row.querySelector(".order-prod-select");
    const qtyInput = row.querySelector(".order-prod-qty");
    const subtotalEl = row.querySelector(".order-prod-subtotal");

    const selectedOption = select.options[select.selectedIndex];
    const price = selectedOption && selectedOption.dataset.price ? parseFloat(selectedOption.dataset.price) : 0;
    const qty = parseInt(qtyInput.value) || 0;

    const subtotal = price * qty;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    total += subtotal;
  });

  document.getElementById("orderTotalDisplay").textContent = `$${total.toFixed(2)}`;
}

async function handleOrderSubmit(e) {
  e.preventDefault();
  const customer_name = document.getElementById("orderCustName").value.trim();
  const customer_email = document.getElementById("orderCustEmail").value.trim();
  const payment_method = document.getElementById("orderPaymentMethod").value;

  const rows = document.querySelectorAll(".order-item-row");
  const items = [];

  for (const row of rows) {
    const select = row.querySelector(".order-prod-select");
    const qtyInput = row.querySelector(".order-prod-qty");

    const productId = select.value;
    const qty = parseInt(qtyInput.value);

    if (productId && qty > 0) {
      items.push({ product_id: parseInt(productId), quantity: qty });
    }
  }

  if (items.length === 0) {
    showToast("Please select at least one line item.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({
        customer_name,
        customer_email: customer_email || undefined,
        payment_method,
        items
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order placement failed");

    showToast(`Invoice ${data.order.order_number} recorded!`, "success");
    closeOrderModal();
    loadOrders();
    loadProducts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ========================
// AUDIT LOGS
// ========================
async function loadAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      headers: { "Authorization": `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const tbody = document.getElementById("auditTableBody");
    if (data.logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-light);font-style:italic;">No ledger entries.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.logs.map(log => `
      <tr>
        <td><code>${new Date(log.created_at).toLocaleString()}</code></td>
        <td><strong>${log.user_name}</strong></td>
        <td><span class="ftag ftag-dark">${log.action}</span></td>
        <td>${log.details}</td>
        <td><code>${log.ip_address || '127.0.0.1'}</code></td>
      </tr>
    `).join("");
  } catch (err) {
    showToast(`Audit ledger error: ${err.message}`, "error");
  }
}

// ========================
// CSV EXPORT
// ========================
function exportCurrentTableToCSV() {
  const activeNav = document.querySelector(".nav-link.active")?.getAttribute("href");
  let filename = "swiftstock_ledger_export.csv";
  let csvContent = "";

  if (activeNav === "#products" || activeNav === "#dashboard") {
    filename = `swiftstock_inventory_${new Date().toISOString().slice(0,10)}.csv`;
    csvContent = "ID,SKU,Name,Category,Price,Stock Quantity,Status\n";
    allProducts.forEach(p => {
      csvContent += `"${p.id}","${p.sku}","${p.name.replace(/"/g, '""')}","${p.category}","${p.price}","${p.stock_quantity}","${p.status}"\n`;
    });
  } else if (activeNav === "#orders") {
    filename = `swiftstock_sales_${new Date().toISOString().slice(0,10)}.csv`;
    csvContent = "Order Number,Customer,Email,Total Amount,Payment Method,Created By,Date\n";
    allOrders.forEach(o => {
      csvContent += `"${o.order_number}","${o.customer_name}","${o.customer_email || ''}","${o.total_amount}","${o.payment_method}","${o.created_by_name || ''}","${o.created_at}"\n`;
    });
  } else {
    filename = `swiftstock_audit_${new Date().toISOString().slice(0,10)}.csv`;
    csvContent = "Type,Details,Timestamp\n";
    csvContent += `"System Report","SwiftStock Commerce System Export","${new Date().toISOString()}"\n`;
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Exported ${filename}`, "success");
}
