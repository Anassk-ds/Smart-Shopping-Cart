# Smart Shopping Cart

A browser-based shopping cart app built with plain HTML, CSS, and JavaScript. No frameworks, no local storage, no backend — everything runs in memory in the browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and all CSS styling |
| `script.js` | All application logic (catalog, cart, coupons, checkout) |

Both files must stay in the same folder — `index.html` loads `script.js` via a relative `<script src="script.js">` tag.

## How to Run

Just open `index.html` in any modern web browser. No build step, no server, no dependencies.

## Features

### Product Catalog
- 12 sample products across three categories: Electronics, Stationery, Accessories
- Products are rendered dynamically from a JavaScript array — nothing is hardcoded in the HTML
- Live search by product name as you type
- Category filter buttons (All, Electronics, Stationery, Accessories)

### Shopping Cart
- Add products to the cart with one click
- Adding a product already in the cart increases its quantity instead of duplicating the row
- Increase / decrease quantity per item (reaching 0 removes the item)
- Remove any item directly
- Live totals: total item count and subtotal price

### Checkout & Invoice
- Two working coupon codes: `SAVE10` (10% off) and `SAVE20` (20% off)
- Invalid codes show an error message
- 5% GST applied after discount
- Checkout requires a customer name and a non-empty cart
- On successful checkout, an invoice modal displays:
  - Customer name, invoice number, and date
  - Itemized list of purchased products
  - Subtotal, discount, GST, and grand total
- Cart automatically clears after checkout

## Notes

- All data (products, cart, coupons) lives in memory only — refreshing the page resets everything, since local storage and databases are intentionally not used.
- Prices are shown in ₹ (INR); change the `formatPrice()` function in `script.js` to use a different currency symbol.
