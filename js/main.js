// =============================
// 🛒 CARRITO DE COMPRAS - DOS HERMANOS ALIMENTOS
// =============================

// Referencias principales
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cart-count");

// Crear el carrito lateral y overlay
const cartSidebar = document.createElement("div");
cartSidebar.classList.add("cart-sidebar");
cartSidebar.innerHTML = `
  <div class="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
    <h5 class="m-0 fw-bold text-brown">🛍️ Tu pedido</h5>
    <button class="btn-close" id="closeCart"></button>
  </div>
  <div class="cart-body p-3" id="cartBody"></div>
  <div class="cart-footer border-top p-3">
    <p class="fw-bold text-brown mb-2">Total: $<span id="cartTotal">0</span></p>
    <button id="checkoutBtn" class="btn btn-dark w-100">Finalizar pedido</button>
  </div>
`;

const cartOverlay = document.createElement("div");
cartOverlay.classList.add("cart-overlay");

// Agregar al body
document.body.appendChild(cartSidebar);
document.body.appendChild(cartOverlay);

// Estado del carrito
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =============================
// Abrir y cerrar carrito
// =============================
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
  });
}

document.addEventListener("click", (e) => {
  if (e.target.id === "closeCart" || e.target === cartOverlay) {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  }
});

// =============================
// Agregar productos
// =============================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-dark") && e.target.textContent.includes("Agregar")) {
    const card = e.target.closest(".producto-card");
    const name = card.querySelector("h5").textContent;
    const priceText = card.querySelector(".precio").textContent.replace("$", "").trim();
    const price = parseFloat(priceText);

    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCart();
  }
});

// =============================
// Actualizar carrito visualmente
// =============================
function updateCart() {
  const cartBody = document.getElementById("cartBody");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartBody || !cartTotal || !cartCount) return;

  cartBody.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "mb-2");
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        <small class="text-muted">x${item.qty}</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <strong class="text-brown">$${(item.price * item.qty).toFixed(0)}</strong>
        <button class="btn btn-sm btn-outline-danger" data-index="${index}">✕</button>
      </div>
    `;
    cartBody.appendChild(div);
  });

  cartCount.textContent = count;
  cartTotal.textContent = total.toFixed(0);

  localStorage.setItem("cart", JSON.stringify(cart));

  // Botones eliminar
  document.querySelectorAll(".btn-outline-danger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// =============================
// Finalizar pedido (WhatsApp)
// =============================
document.addEventListener("click", (e) => {
  if (e.target.id === "checkoutBtn") {
    if (cart.length === 0) {
      alert("Tu carrito está vacío 🐾");
      return;
    }

    let message = "¡Hola! Quiero hacer el siguiente pedido:%0A";
    cart.forEach((item) => {
      message += `• ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(0)}%0A`;
    });
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    message += `%0ATotal: $${total.toFixed(0)}`;

    window.open(`https://wa.me/59897319488?text=${message}`, "_blank");
  }
});

// =============================
// Estilos dinámicos del carrito
// =============================
const style = document.createElement("style");
style.textContent = `
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -380px;
  width: 320px;
  height: 100%;
  background-color: #fff;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 1050;
  transition: right 0.4s ease;
  display: flex;
  flex-direction: column;
}
.cart-sidebar.active { right: 0; }
.cart-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1040;
  display: none;
}
.cart-overlay.active { display: block; }
`;
document.head.appendChild(style);

// =============================
// Inicialización
// =============================
document.addEventListener("DOMContentLoaded", () => {
  updateCart();
});
// Script para abrir/cerrar el menú hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar menú al tocar un link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
