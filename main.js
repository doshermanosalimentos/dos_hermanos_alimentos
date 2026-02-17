// ==========================================
// 🚀 MAIN.JS - DOS HERMANOS (VERSIÓN FINAL)
// ==========================================

// 1. CARGA INICIAL: Recupera el carrito guardado
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    setupMobileMenu();
    updateCartUI(); // Dibuja el carrito al cargar la página
    initEventListeners();
});

function initEventListeners() {
    document.addEventListener("click", (e) => {
        // AGREGAR AL CARRITO
        if (e.target.classList.contains("add-btn")) {
            const card = e.target.closest(".product-card");
            const name = card.dataset.name || card.querySelector("h3").textContent;
            const priceText = card.dataset.price || card.querySelector(".price").textContent.replace(/[^0-9]/g, "");
            const price = parseFloat(priceText);

            addToCart(name, price);
            
            // Efecto visual de éxito
            const originalText = e.target.textContent;
            e.target.textContent = "✓";
            e.target.style.background = "#25D366";
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.background = "";
            }, 800);
        }

        // ABRIR CARRITO
        if (e.target.id === "open-cart" || e.target.closest("#open-cart")) {
            document.querySelector(".cart-sidebar").classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
        }

        // CERRAR CARRITO
        if (e.target.id === "closeCart" || e.target.classList.contains("cart-overlay") || e.target.closest("#closeCart")) {
            document.querySelector(".cart-sidebar").classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
        }

        // FINALIZAR WHATSAPP
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

    if (cartCount) cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
    
    if (cartTotal) {
        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        cartTotal.textContent = total.toLocaleString();
    }

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

window.changeQty = (index, delta) => {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

function setupMobileMenu() {
    // Usamos IDs para asegurar que encuentre los elementos
    const menuBtn = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuBtn && navLinks) {
        menuBtn.onclick = (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        };
    }
}

