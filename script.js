// ---------- Data ----------
const products = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 599 },
  { id: 2, name: "Bluetooth Headphones", category: "Electronics", price: 1499 },
  { id: 3, name: "USB-C Charging Cable", category: "Electronics", price: 299 },
  { id: 4, name: "Mechanical Keyboard", category: "Electronics", price: 2499 },
  { id: 5, name: "Notebook (A5, 200 pages)", category: "Stationery", price: 89 },
  { id: 6, name: "Gel Pen Set (10pc)", category: "Stationery", price: 120 },
  { id: 7, name: "Sticky Notes Pack", category: "Stationery", price: 65 },
  { id: 8, name: "Highlighter Set", category: "Stationery", price: 150 },
  { id: 9, name: "Leather Wallet", category: "Accessories", price: 899 },
  { id: 10, name: "Sunglasses", category: "Accessories", price: 749 },
  { id: 11, name: "Canvas Backpack", category: "Accessories", price: 1299 },
  { id: 12, name: "Analog Wrist Watch", category: "Accessories", price: 1999 }
];

const coupons = {
  "SAVE10": 0.10,
  "SAVE20": 0.20
};

const GST_RATE = 0.05;

// ---------- State ----------
let cart = []; // { id, name, price, quantity }
let currentCategory = "All";
let currentSearch = "";
let appliedCoupon = null; // { code, rate }
let invoiceCounter = 1000;

// ---------- Elements ----------
const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const cartBody = document.getElementById("cartBody");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const totalItemsEl = document.getElementById("totalItems");
const subtotalPriceEl = document.getElementById("subtotalPrice");
const discountAmountEl = document.getElementById("discountAmount");
const gstAmountEl = document.getElementById("gstAmount");
const grandTotalEl = document.getElementById("grandTotal");
const couponInput = document.getElementById("couponInput");
const couponMsg = document.getElementById("couponMsg");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const customerNameInput = document.getElementById("customerName");
const invoiceOverlay = document.getElementById("invoiceOverlay");
const invoiceDetails = document.getElementById("invoiceDetails");
const closeInvoiceBtn = document.getElementById("closeInvoiceBtn");

// ---------- Catalog Rendering ----------
function renderCategoryButtons() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  categoryButtons.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === currentCategory) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentCategory = cat;
      renderCategoryButtons();
      renderProducts();
    });
    categoryButtons.appendChild(btn);
  });
}

function formatPrice(n) {
  return "₹" + n.toFixed(2);
}

function renderProducts() {
  const filtered = products.filter(p => {
    const matchesCategory = currentCategory === "All" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = "";
  noResults.style.display = filtered.length === 0 ? "block" : "none";

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${escapeHtml(p.name)}</h3>
      <div class="cat">${escapeHtml(p.category)}</div>
      <div class="price">${formatPrice(p.price)}</div>
      <button data-id="${p.id}">Add to Cart</button>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(p.id));
    productGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  renderProducts();
});

// ---------- Cart Logic ----------
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
  }
  renderCart();
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function renderCart() {
  cartBody.innerHTML = "";
  emptyCartMsg.style.display = cart.length === 0 ? "block" : "none";

  let totalItems = 0;
  let subtotal = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${formatPrice(item.price)}</td>
      <td class="qty-controls">
        <button data-action="dec" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button data-action="inc" data-id="${item.id}">+</button>
      </td>
      <td>${formatPrice(itemSubtotal)}</td>
      <td><button class="remove-btn" data-id="${item.id}">✕</button></td>
    `;
    cartBody.appendChild(row);
  });

  cartBody.querySelectorAll('button[data-action="inc"]').forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), 1))
  );
  cartBody.querySelectorAll('button[data-action="dec"]').forEach(btn =>
    btn.addEventListener("click", () => changeQuantity(parseInt(btn.dataset.id), -1))
  );
  cartBody.querySelectorAll('.remove-btn').forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id)))
  );

  totalItemsEl.textContent = totalItems;
  subtotalPriceEl.textContent = formatPrice(subtotal);

  updateSummary(subtotal);
}

// ---------- Coupon Logic ----------
applyCouponBtn.addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();
  if (!code) {
    couponMsg.textContent = "Please enter a coupon code.";
    couponMsg.className = "error";
    return;
  }
  if (coupons[code]) {
    appliedCoupon = { code, rate: coupons[code] };
    couponMsg.textContent = `Coupon "${code}" applied: ${coupons[code] * 100}% off.`;
    couponMsg.className = "success";
  } else {
    appliedCoupon = null;
    couponMsg.textContent = "Invalid coupon code.";
    couponMsg.className = "error";
  }
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  updateSummary(subtotal);
});

function updateSummary(subtotal) {
  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * GST_RATE;
  const grandTotal = afterDiscount + gst;

  discountAmountEl.textContent = "-" + formatPrice(discount);
  gstAmountEl.textContent = formatPrice(gst);
  grandTotalEl.textContent = formatPrice(grandTotal);
}

// ---------- Checkout / Invoice ----------
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some products before checking out.");
    return;
  }
  const name = customerNameInput.value.trim();
  if (!name) {
    alert("Please enter your name before checking out.");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * GST_RATE;
  const grandTotal = afterDiscount + gst;

  invoiceCounter += 1;
  const invoiceNumber = "INV-" + invoiceCounter;
  const dateStr = new Date().toLocaleString();

  let rowsHtml = "";
  cart.forEach(item => {
    rowsHtml += `<tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${item.quantity}</td>
      <td>${formatPrice(item.price)}</td>
      <td>${formatPrice(item.price * item.quantity)}</td>
    </tr>`;
  });

  invoiceDetails.innerHTML = `
    <p><strong>Customer:</strong> ${escapeHtml(name)}<br>
    <strong>Invoice #:</strong> ${invoiceNumber}<br>
    <strong>Date:</strong> ${dateStr}</p>
    <table>
      <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="summary-row"><span>Subtotal:</span><span>${formatPrice(subtotal)}</span></div>
    <div class="summary-row"><span>Discount${appliedCoupon ? " (" + appliedCoupon.code + ")" : ""}:</span><span>-${formatPrice(discount)}</span></div>
    <div class="summary-row"><span>GST (5%):</span><span>${formatPrice(gst)}</span></div>
    <div class="summary-row total"><span>Grand Total:</span><span>${formatPrice(grandTotal)}</span></div>
  `;

  invoiceOverlay.classList.add("show");

  // Clear cart automatically
  cart = [];
  appliedCoupon = null;
  couponInput.value = "";
  couponMsg.textContent = "";
  customerNameInput.value = "";
  renderCart();
});

closeInvoiceBtn.addEventListener("click", () => {
  invoiceOverlay.classList.remove("show");
});

// ---------- Init ----------
renderCategoryButtons();
renderProducts();
renderCart();
