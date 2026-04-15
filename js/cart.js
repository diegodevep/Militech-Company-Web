// =========================
// CART.JS
// =========================

// ---------- CONFIG ----------
const STORE_CONFIG = {
  currencySymbol: "S/",
  currencyCode: "PEN",
  shippingCost: 0, // cambia si luego quieres cobrar envío
  whatsappNumber: "51956819118" // <-- REEMPLAZA POR TU NÚMERO
};

// ---------- STORAGE ----------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
  updateCartCount();
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch (error) {
    console.error("Error reading orders from localStorage:", error);
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
}

// ---------- FORMAT ----------
function formatMoney(value) {
  return `${STORE_CONFIG.currencySymbol} ${Number(value).toFixed(2)}`;
}

function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

// ---------- CART COUNT ----------
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

  const countEl = document.querySelector(".cart_num");
  if (countEl) {
    countEl.textContent = totalItems;
  }
}

// ---------- ADD TO CART ----------
window.addToCart = function (productName, price, image = "images/product_1.jpg") {
  let cart = getCart();

  const cleanName = sanitizeText(productName);
  const cleanPrice = Number(price) || 0;
  const cleanImage = sanitizeText(image) || "images/product_1.jpg";

  if (!cleanName || cleanPrice <= 0) {
    console.warn("Invalid product data:", { productName, price, image });
    return;
  }

  const existingProduct = cart.find(item => item.name === cleanName);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: cleanName,
      price: cleanPrice,
      image: cleanImage,
      quantity: 1
    });
  }

  saveCart(cart);
};

// ---------- REMOVE ITEM ----------
function removeCartItem(itemId) {
  let cart = getCart();
  cart = cart.filter(item => String(item.id) !== String(itemId));
  saveCart(cart);
  renderCart();
  renderCheckout();
}

// ---------- UPDATE ITEM QUANTITY ----------
function updateItemQuantity(itemId, quantity) {
  let cart = getCart();

  const item = cart.find(product => String(product.id) === String(itemId));
  if (!item) return;

  const parsedQuantity = parseInt(quantity, 10);

  if (isNaN(parsedQuantity) || parsedQuantity < 1) {
    item.quantity = 1;
  } else {
    item.quantity = parsedQuantity;
  }

  saveCart(cart);
  renderCart();
  renderCheckout();
}

// ---------- CLEAR CART ----------
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
  renderCheckout();
}

// ---------- TOTALS ----------
function calculateCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
  const shipping = cart.length > 0 ? Number(STORE_CONFIG.shippingCost) : 0;
  const total = subtotal + shipping;

  return {
    subtotal,
    shipping,
    total
  };
}

// ---------- CART TOTALS ----------
function updateCartTotals() {
  const totals = calculateCartTotals();

  const subtotalEl = document.getElementById("cart_subtotal");
  const shippingEl = document.getElementById("cart_shipping");
  const totalEl = document.getElementById("cart_total");

  if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);
  if (shippingEl) shippingEl.textContent = formatMoney(totals.shipping);
  if (totalEl) totalEl.textContent = formatMoney(totals.total);
}

// ---------- CHECKOUT TOTALS ----------
function updateCheckoutTotals() {
  const totals = calculateCartTotals();

  const subtotalEl = document.getElementById("checkout_subtotal");
  const shippingEl = document.getElementById("checkout_shipping");
  const totalEl = document.getElementById("checkout_total");

  if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);
  if (shippingEl) shippingEl.textContent = formatMoney(totals.shipping);
  if (totalEl) totalEl.textContent = formatMoney(totals.total);
}

// ---------- RENDER CART ----------
function renderCart() {
  const cartList = document.querySelector(".cart_list");
  if (!cartList) return;

  const cart = getCart();

  if (!cart.length) {
    cartList.innerHTML = "";
    updateCartTotals();

    const emptyMsg = document.querySelector(".cart_empty_message");
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  const emptyMsg = document.querySelector(".cart_empty_message");
  if (emptyMsg) emptyMsg.style.display = "none";

  cartList.innerHTML = cart.map(item => {
    const itemTotal = Number(item.price) * Number(item.quantity);

    return `
      <li class="cart_product d-flex flex-md-row flex-column align-items-md-center align-items-start justify-content-start" data-id="${item.id}">
        <div class="cart_product_image">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <div class="cart_product_name">
          <a href="product.html">${item.name}</a>
        </div>

        <div class="cart_product_info ml-auto">
          <div class="cart_product_info_inner d-flex flex-row align-items-center justify-content-md-end justify-content-start">
            <div class="cart_product_price">${formatMoney(item.price)}</div>

            <div class="product_quantity_container">
              <div class="product_quantity clearfix">
                <input 
                  class="cart_quantity_input" 
                  type="number" 
                  min="1" 
                  value="${item.quantity}" 
                  data-id="${item.id}"
                >
              </div>
            </div>

            <div class="cart_product_total">${formatMoney(itemTotal)}</div>

            <div class="cart_product_button">
              <button class="cart_product_remove" data-id="${item.id}" type="button" style="background:none;border:none;cursor:pointer;">
                <img src="images/trash.png" alt="Remove">
              </button>
            </div>
          </div>
        </div>
      </li>
    `;
  }).join("");

  updateCartTotals();
}

// ---------- RENDER CHECKOUT ----------
function renderCheckout() {
  const checkoutList = document.querySelector(".checkout_list");
  if (!checkoutList) return;

  const cart = getCart();

  if (!cart.length) {
    checkoutList.innerHTML = `
      <li class="d-flex flex-row align-items-center justify-content-start">
        <div class="order_list_title">Tu carrito está vacío</div>
        <div class="order_list_value ml-auto">${formatMoney(0)}</div>
      </li>
    `;
    updateCheckoutTotals();
    return;
  }

  checkoutList.innerHTML = cart.map(item => {
    const itemTotal = Number(item.price) * Number(item.quantity);

    return `
      <li class="d-flex flex-row align-items-center justify-content-start">
        <div class="order_list_title">${item.name} x${item.quantity}</div>
        <div class="order_list_value ml-auto">${formatMoney(itemTotal)}</div>
      </li>
    `;
  }).join("");

  updateCheckoutTotals();
}

// ---------- WHATSAPP MESSAGE ----------
function buildWhatsAppMessage(order) {
  const customer = order.customer || {};

  let message = "🛒 *Nuevo pedido desde la web*%0A%0A";

  message += `*Orden:* ${order.id}%0A`;
  message += `*Fecha:* ${new Date(order.date).toLocaleString("es-PE")}%0A%0A`;

  message += "👤 *Datos del cliente*%0A";
  message += `Nombre: ${sanitizeText(customer.first_name || customer.name)} ${sanitizeText(customer.last_name)}%0A`;
  message += `Celular: ${sanitizeText(customer.phone)}%0A`;
  message += `Correo: ${sanitizeText(customer.email)}%0A`;
  message += `DNI: ${sanitizeText(customer.dni)}%0A`;
  message += `Ciudad: ${sanitizeText(customer.city)}%0A`;
  message += `Dirección: ${sanitizeText(customer.address)}%0A`;
  message += `Referencia: ${sanitizeText(customer.reference)}%0A`;
  message += `Notas: ${sanitizeText(customer.notes)}%0A%0A`;

  message += "📦 *Productos*%0A";
  order.items.forEach(item => {
    const lineTotal = Number(item.price) * Number(item.quantity);
    message += `- ${item.name} x${item.quantity} = ${formatMoney(lineTotal)}%0A`;
  });

  message += `%0A`;
  message += `Subtotal: ${formatMoney(order.subtotal)}%0A`;
  message += `Envío: ${formatMoney(order.shipping)}%0A`;
  message += `*Total: ${formatMoney(order.total)}*`;

  return message;
}

// ---------- CREATE ORDER ----------
function createOrder(customerData = {}) {
  const cart = getCart();

  if (!cart.length) {
    alert("Tu carrito está vacío.");
    return null;
  }

  const orders = getOrders();
  const totals = calculateCartTotals();

  const order = {
    id: "ORD-" + Date.now(),
    date: new Date().toISOString(),
    customer: {
      first_name: sanitizeText(customerData.first_name || customerData.name),
      last_name: sanitizeText(customerData.last_name),
      name: sanitizeText(customerData.name),
      email: sanitizeText(customerData.email),
      phone: sanitizeText(customerData.phone),
      dni: sanitizeText(customerData.dni),
      city: sanitizeText(customerData.city),
      address: sanitizeText(customerData.address),
      reference: sanitizeText(customerData.reference),
      notes: sanitizeText(customerData.notes)
    },
    items: cart,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    status: "pending"
  };

  orders.push(order);
  saveOrders(orders);

  const whatsappMessage = buildWhatsAppMessage(order);
  const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
  renderCheckout();

  window.open(whatsappUrl, "_blank");

  return order;
}

window.createOrder = createOrder;
window.clearCart = clearCart;

// ---------- EVENTS ----------
document.addEventListener("click", function (event) {
  const removeButton = event.target.closest(".cart_product_remove");
  if (removeButton) {
    const itemId = removeButton.getAttribute("data-id");
    removeCartItem(itemId);
    return;
  }

  const clearButton = event.target.closest("#clear_cart_btn");
  if (clearButton) {
    clearCart();
    return;
  }
});

document.addEventListener("change", function (event) {
  if (event.target.classList.contains("cart_quantity_input")) {
    const itemId = event.target.getAttribute("data-id");
    const quantity = event.target.value;
    updateItemQuantity(itemId, quantity);
  }
});

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  renderCart();
  renderCheckout();
});