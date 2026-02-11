// ==========================================
// 🚀 MAIN.JS - DOS HERMANOS (CARRITO + MENÚ)
// ==========================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupMobileMenu();
    updateCartUI();
});

function initApp() {
    // Escuchar clics en botones "Agregar"
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-btn")) {
            const card = e.target.closest(".product-card");
            const name = card.dataset.name || card.querySelector("h3").textContent;
            const priceText = card.dataset.price || card.querySelector(".price").textContent.replace("$", "").replace(".", "").trim();
            const price = parseFloat(priceText);

            addToCart(name, price);
            
            // Efecto visual en el botón
            const originalText = e.target.textContent;
            e.target.textContent = "✓";
            setTimeout(() => e.target.textContent = originalText, 800);
        }

        // Abrir carrito
        if (e.target.id === "open-cart" || e.target.closest("#open-cart")) {
            document.querySelector(".cart-sidebar").classList.add("active");
            document.querySelector(".cart-overlay").classList.add("active");
        }

        // Cerrar carrito
        if (e.target.id === "closeCart" || e.target.classList.contains("cart-overlay")) {
            document.querySelector(".cart-sidebar").classList.remove("active");
            document.querySelector(".cart-overlay").classList.remove("active");
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
        cartBody.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.qty} x $${item.price.toLocaleString()}</small>
                </div>
                <button onclick="removeFromCart(${index})" class="btn-delete">✕</button>
            </div>
        `).join('');
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

// ==========================================
// 📱 LÓGICA MENÚ MÓVIL (LAS 3 RAYITAS)
// ==========================================
function setupMobileMenu() {
    const navInner = document.querySelector('.nav-inner');
    const navLinks = document.querySelector('.nav-links');
    
    if (navInner && navLinks && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.classList.add('mobile-menu-btn');
        menuBtn.innerHTML = '☰'; // Icono 3 rayas
        navInner.prepend(menuBtn); // Lo pone al principio

        menuBtn.onclick = () => {
            navLinks.classList.toggle('active');
            menuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        };
    }
}

// Finalizar pedido WhatsApp
document.addEventListener("click", (e) => {
    if (e.target.id === "checkoutBtn") {
        if (cart.length === 0) return alert("El carrito está vacío 🐾");
        let msg = "¡Hola Dos Hermanos! Quisiera este pedido:%0A";
        cart.forEach(i => msg += `• ${i.name} (x${i.qty})%0A`);
        const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        msg += `%0A*Total: $${total}*`;
        window.open(`https://wa.me/59897319488?text=${msg}`, '_blank');
    }
});
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Cambia el icono de ☰ a ✕ al abrir
    menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});