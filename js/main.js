// ==========================================
// 🛒 CARRITO Y MENÚ - DOS HERMANOS ALIMENTOS
// ==========================================

// 1. ESTADO DEL CARRITO
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 2. REFERENCIAS PRINCIPALES
// Asegúrate de que en tu HTML el botón del carrito tenga id="cartBtn"
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cart-count");

// 3. CREAR SIDEBAR DEL CARRITO DINÁMICAMENTE
const cartSidebar = document.createElement("div");
cartSidebar.classList.add("cart-sidebar");
cartSidebar.innerHTML = `
  <div class="cart-header d-flex justify-content-between align-items-center p-3 border-bottom">
    <h5 class="m-0 fw-bold" style="color:#7a5c45;">🛍️ Tu pedido</h5>
    <button class="btn-close" id="closeCart" style="border:none; background:none; font-size:20px; cursor:pointer;">✕</button>
  </div>
  <div class="cart-body p-3" id="cartBody" style="flex-grow:1; overflow-y:auto;"></div>
  <div class="cart-footer border-top p-3">
    <p class="fw-bold mb-2">Total: $<span id="cartTotal">0</span></p>
    <button id="checkoutBtn" class="btn-finalizar">Finalizar pedido por WhatsApp</button>
  </div>
`;

const cartOverlay = document.createElement("div");
cartOverlay.classList.add("cart-overlay");

document.body.appendChild(cartSidebar);
document.body.appendChild(cartOverlay);

// 4. LÓGICA DE APERTURA/CIERRE (CARRITO Y MENÚ)
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Abrir Carrito
if (cartBtn) {
    cartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
        if(navLinks) navLinks.classList.remove("active"); // Cierra el menú si el carrito se abre
    });
}

// Menú Hamburguesa Móvil
if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        cartSidebar.classList.remove("active"); // Cierra el carrito si el menú se abre
        cartOverlay.classList.remove("active");
    });
}

// Cerrar todo (Overlay, Botón X, o clics fuera)
document.addEventListener("click", (e) => {
    if (e.target.id === "closeCart" || e.target === cartOverlay) {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
    }
    // Cerrar menú móvil al hacer clic fuera
    if (navLinks && !navLinks.contains(e.target) && e.target !== menuToggle) {
        navLinks.classList.remove("active");
    }
});

// 5. AGREGAR PRODUCTOS
document.addEventListener("click", (e) => {
    // Detecta clics en botones que contengan "Agregar"
    if (e.target.classList.contains("btn-add") || (e.target.tagName === "BUTTON" && e.target.textContent.includes("Agregar"))) {
        const card = e.target.closest(".product") || e.target.closest(".producto-card");
        if (!card) return;

        const name = card.querySelector("h4, h5").textContent;
        const priceText = card.querySelector(".price, .precio").textContent.replace("$", "").trim();
        const price = parseFloat(priceText);

        const existing = cart.find((item) => item.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        updateCart();
        // Opcional: abrir el carrito automáticamente al agregar
        cartSidebar.classList.add("active");
        cartOverlay.classList.add("active");
    }
});

// 6. ACTUALIZAR VISUALIZACIÓN
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
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;";
        div.innerHTML = `
            <div>
                <strong style="font-size:14px;">${item.name}</strong><br>
                <small style="color:#777;">$${item.price} x ${item.qty}</small>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <strong style="color:#7a5c45;">$${(item.price * item.qty).toFixed(0)}</strong>
                <button class="btn-remove" data-index="${index}" style="background:none; border:none; color:red; cursor:pointer;">✕</button>
            </div>
        `;
        cartBody.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString();

    localStorage.setItem("cart", JSON.stringify(cart));

    // Eventos para eliminar
    document.querySelectorAll(".btn-remove").forEach((btn) => {
        btn.onclick = (e) => {
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            updateCart();
        };
    });
}

// 7. FINALIZAR PEDIDO (WHATSAPP)
document.addEventListener("click", (e) => {
    if (e.target.id === "checkoutBtn") {
        if (cart.length === 0) {
            alert("Tu carrito está vacío 🐾");
            return;
        }

        let message = "¡Hola Dos Hermanos! Quiero hacer el siguiente pedido:%0A%0A";
        cart.forEach((item) => {
            message += `• ${item.name} (x${item.qty}) - $${(item.price * item.qty).toFixed(0)}%0A`;
        });
        const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
        message += `%0A*Total a pagar: $${total.toFixed(0)}*%0A%0A_Enviado desde la web_`;

        window.open(`https://wa.me/59897319488?text=${message}`, "_blank");
    }
});

// 8. ESTILOS NECESARIOS (CSS EN JS)
const style = document.createElement("style");
style.textContent = `
  .cart-sidebar {
    position: fixed; top: 0; right: -400px;
    width: 350px; height: 100%;
    background: #fff; z-index: 2000;
    transition: 0.4s; display: flex; flex-direction: column;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
  }
  .cart-sidebar.active { right: 0; }
  .cart-overlay {
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 1900;
    display: none;
  }
  .cart-overlay.active { display: block; }
  .btn-finalizar {
    background: #25d366; color: white; border: none;
    padding: 12px; border-radius: 8px; width: 100%;
    font-weight: bold; cursor: pointer; font-size: 16px;
  }
  @media (max-width: 400px) {
    .cart-sidebar { width: 100%; right: -100%; }
  }
`;
document.head.appendChild(style);

// 9. INICIO
document.addEventListener("DOMContentLoaded", updateCart);
