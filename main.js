// ==========================================
// 🚀 MAIN.JS - DOS HERMANOS (CARRITO + MENÚ)
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    updateCartUI();
    initEventListeners();
});

function initEventListeners() {
    document.addEventListener("click", (e) => {
        // 1. Agregar al carrito
        if (e.target.classList.contains("add-btn")) {
            const card = e.target.closest(".product-card");
            const name = card.dataset.name || card.querySelector("h3").textContent;
            // Limpia el precio de símbolos y puntos para que sea un número puro
            const priceText = card.dataset.price || card.querySelector(".price").textContent.replace(/[^0-9]/g, "");
            const price = parseFloat(priceText);

            addToCart(name, price);
            
            // Efecto visual rápido
            const originalText = e.target.textContent;
            e.target.textContent = "✓";
            e.target.style.background = "#25D366";
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.background = "";
            }, 800);
        }

        // 2. Abrir carrito (Sidebar)
        if (e.target.id === "open-cart" || e.target.closest("#open-cart")) {
            document.querySelector(".cart-sidebar").classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
        }

        // 3. Cerrar carrito
        if (e.target.id === "closeCart" || e.target.classList.contains("cart-overlay") || e.target.closest("#closeCart")) {
            document.querySelector(".cart-sidebar").classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
        }

        // 4. Finalizar pedido WhatsApp
        if (e.target.id === "checkoutBtn") {
            if (cart.length === 0) return alert("El carrito está vacío 🐾");
            
            let msg = "¡Hola Dos Hermanos! Quisiera este pedido:%0A%0A";
            cart.forEach(i => msg += `• ${i.name} (x${i.qty})%0A`);
            const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
            msg += `%0A*Total: $${total.toLocaleString()}*`;
            
            window.open(`https://wa.me/59897319488?text=${msg}`, '_blank');
        }
    });
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    const cartBody = document.getElementById("cartBody");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cartTotal");

    // Actualiza burbuja de cantidad
    if (cartCount) cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
    
    // Actualiza total de la sidebar
    if (cartTotal) {
        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        cartTotal.textContent = total.toLocaleString();
    }

    // Genera el HTML de los items
    if (cartBody) {
        if (cart.length === 0) {
            cartBody.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;">Tu carrito está vacío</p>`;
        } else {
            cartBody.innerHTML = cart.map((item, index) => `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                    <div style="flex-grow:1;">
                        <div style="font-weight:600; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#777;">${item.qty} x $${item.price.toLocaleString()}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <button onclick="changeQty(${index}, -1)" style="border:none; background:#eee; padding:2px 8px; border-radius:4px; cursor:pointer;">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)" style="border:none; background:#eee; padding:2px 8px; border-radius:4px; cursor:pointer;">+</button>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#e57373; cursor:pointer; margin-left:5px;">✕</button>
                    </div>
                </div>
            `).join('');
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Funciones globales para botones del carrito
window.changeQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

// ==========================================
// 📱 LÓGICA MENÚ MÓVIL
// ==========================================
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.onclick = () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        };
    }
}
