// Main JavaScript for FurniStyle

const API_URL = 'http://localhost:8080/api';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCartCount();
    checkUserLogin();
    updateUserNavbar();
});

// Load Cart Count
function loadCartCount() {
    const cart = getCart();
    const count = cart.items ? cart.items.length : 0;
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

// Cart Management
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification('Added to cart!', 'success');
}

function removeFromCart(productId) {
    const cart = getCart();
    cart.items = cart.items.filter(item => item.id !== productId);
    saveCart(cart);
    loadCartCount();
    if (typeof loadCart === 'function') loadCart();
}

function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    saveCart({ items: [], total: 0 });
}

// User Management
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
    updateUserNavbar();
    // Redirect to home page from any location
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? '../index.html' : 'index.html';
}

function checkUserLogin() {
    const user = getCurrentUser();
    if (!user && window.location.pathname.includes('checkout.html')) {
        window.location.href = 'login.html';
    }
}

// Notification
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// API Calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(API_URL + endpoint, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}
// Format Currency (Sri Lankan Rupees)
function formatCurrency(amount) {
    return 'Rs ' + parseInt(amount).toLocaleString();
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update User Navbar
function updateUserNavbar() {
    const user = getCurrentUser();
    const authNav = document.getElementById('auth-nav');
    
    if (!authNav) return;
    
    if (user) {
        const defaultAvatar = 'https://via.placeholder.com/40x40?text=' + user.name.charAt(0).toUpperCase();
        const userPhoto = user.photo || defaultAvatar;
        const isInPages = window.location.pathname.includes('/pages/');
        const profileLink = isInPages ? 'profile.html' : 'pages/profile.html';
        
        authNav.innerHTML = `
            <div class="nav-link dropdown-toggle d-flex align-items-center" role="button" data-bs-toggle="dropdown">
                <img src="${userPhoto}" alt="${user.name}" class="rounded-circle me-2" width="35" height="35" style="object-fit: cover; aspect-ratio: 1/1; flex-shrink: 0;">
                <span>${user.name}</span>
            </div>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><span class="dropdown-item-text">Hi, ${user.name}!</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="${profileLink}">My Profile</a></li>
                <li><a class="dropdown-item" href="#" onclick="logout(); return false;">Logout</a></li>
            </ul>
        `;
    } else {
        authNav.innerHTML = '<a class="nav-link" href="' + (window.location.pathname.includes('/pages/') ? '' : 'pages/') + 'login.html">Login</a>';
    }
}
