// ================= PRODUCTS =================

const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 55000 },
    { id: 2, name: "Mouse", category: "Electronics", price: 700 },
    { id: 3, name: "Keyboard", category: "Electronics", price: 1200 },
    { id: 4, name: "Notebook", category: "Stationery", price: 80 },
    { id: 5, name: "Pen", category: "Stationery", price: 20 },
    { id: 6, name: "Pencil", category: "Stationery", price: 10 },
    { id: 7, name: "Bag", category: "Accessories", price: 1200 },
    { id: 8, name: "Water Bottle", category: "Accessories", price: 350 },
    { id: 9, name: "Headphones", category: "Electronics", price: 2500 },
    { id: 10, name: "Calculator", category: "Stationery", price: 600 }
];

let cart = [];
let discount = 0;

// ================= DISPLAY PRODUCTS =================

const productContainer = document.getElementById("productContainer");

function displayProducts(list) {

    productContainer.innerHTML = "";

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p><b>Category:</b> ${product.category}</p>
            <p><b>Price:</b> ₹${product.price}</p>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productContainer.appendChild(card);

    });

}

displayProducts(products);

// ================= SEARCH =================

document
.getElementById("search")
.addEventListener("keyup", function () {

    const text = this.value.toLowerCase();

    const filtered = products.filter(product =>
        product.name.toLowerCase().includes(text)
    );

    displayProducts(filtered);

});

// ================= CATEGORY FILTER =================

document
.getElementById("category")
.addEventListener("change", function () {

    const category = this.value;

    if (category === "All") {
        displayProducts(products);
        return;
    }

    const filtered = products.filter(product =>
        product.category === category
    );

    displayProducts(filtered);

});

// ================= ADD TO CART =================

function addToCart(id) {

    const product = products.find(item => item.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }

    updateCart();

}
// ================= UPDATE CART =================

function updateCart() {

    const cartBody = document.getElementById("cartBody");

    cartBody.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {

        totalItems += item.qty;

        totalPrice += item.qty * item.price;

        cartBody.innerHTML += `
        <tr>

            <td>${item.name}</td>

            <td>₹${item.price}</td>

            <td>

                <button onclick="decreaseQty(${item.id})">-</button>

                ${item.qty}

                <button onclick="increaseQty(${item.id})">+</button>

            </td>

            <td>₹${item.qty * item.price}</td>

            <td>

                <button onclick="removeItem(${item.id})">

                    Remove

                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("totalItems").textContent = totalItems;

    document.getElementById("totalPrice").textContent = totalPrice;

}

// ================= INCREASE QUANTITY =================

function increaseQty(id) {

    const item = cart.find(product => product.id === id);

    item.qty++;

    updateCart();

}

// ================= DECREASE QUANTITY =================

function decreaseQty(id) {

    const item = cart.find(product => product.id === id);

    if (item.qty > 1) {

        item.qty--;

    } else {

        cart = cart.filter(product => product.id !== id);

    }

    updateCart();

}

// ================= REMOVE PRODUCT =================

function removeItem(id) {

    cart = cart.filter(product => product.id !== id);

    updateCart();

}
// ================= APPLY COUPON =================

document.getElementById("applyCoupon").addEventListener("click", () => {

    const code = document
        .getElementById("coupon")
        .value
        .trim()
        .toUpperCase();

    const msg = document.getElementById("couponMsg");

    if (code === "SAVE10") {

        discount = 10;
        msg.innerHTML = "✅ SAVE10 Applied (10% Discount)";

    }
    else if (code === "SAVE20") {

        discount = 20;
        msg.innerHTML = "✅ SAVE20 Applied (20% Discount)";

    }
    else {

        discount = 0;
        msg.innerHTML = "❌ Invalid Coupon";

    }

});

// ================= CHECKOUT =================

document.getElementById("checkoutBtn").addEventListener("click", checkout);

function checkout() {

    if (cart.length === 0) {

        alert("Cart is Empty!");
        return;

    }

    const customer = document
        .getElementById("customerName")
        .value
        .trim();

    if (customer === "") {

        alert("Enter Customer Name");
        return;

    }

    let subtotal = 0;

    cart.forEach(item => {

        subtotal += item.price * item.qty;

    });

    const discountAmount = subtotal * (discount / 100);

    const afterDiscount = subtotal - discountAmount;

    const gst = afterDiscount * 0.18;

    const grandTotal = afterDiscount + gst;

    const invoiceNo = Math.floor(Math.random() * 1000000);

    const date = new Date().toLocaleString();

    let items = "";

    cart.forEach(item => {

        items += `
${item.name}
Qty : ${item.qty}
Price : ₹${item.price}
Total : ₹${item.qty * item.price}

`;

    });

    document.getElementById("invoice").innerHTML = `

<h2>Invoice</h2>

<hr>

<b>Customer :</b> ${customer}<br>
<b>Invoice No :</b> ${invoiceNo}<br>
<b>Date :</b> ${date}

<hr>

<pre>${items}</pre>

<hr>

<b>Subtotal :</b> ₹${subtotal}<br>

<b>Discount
