// Checkout JavaScript

let currentOrderId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Auto-fill email from logged-in user
    const user = getCurrentUser();
    if (user) {
        document.getElementById('email').value = user.email;
        document.getElementById('firstName').value = user.name.split(' ')[0] || '';
        document.getElementById('lastName').value = user.name.split(' ').slice(1).join(' ') || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('address').value = user.address || '';
    }
    
    loadCheckoutSummary();
    setupCheckoutForm();
});

function loadCheckoutSummary() {
    const cart = getCart();
    const summaryContainer = document.getElementById('order-items-summary');
    
    summaryContainer.innerHTML = '';
    cart.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'd-flex justify-content-between mb-2';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        `;
        summaryContainer.appendChild(itemDiv);
    });
    
    updateCheckoutTotal();
}

function updateCheckoutTotal() {
    const cart = getCart();
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 1500 : 0;  // Rs 1,500 shipping
    const total = subtotal + shipping;
    
    document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkout-shipping').textContent = formatCurrency(shipping);
    document.getElementById('checkout-total').textContent = formatCurrency(total);
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    
    placeOrderBtn.addEventListener('click', function() {
        if (!form.checkValidity() || !validatePaymentForm()) {
            alert('Please fill in all required fields correctly.');
            return;
        }
        
        placeOrder();
    });
}

function validatePaymentForm() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    // Basic validation
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Card number must be 16 digits');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Expiry date must be MM/YY');
        return false;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        alert('CVV must be 3 digits');
        return false;
    }
    
    return true;
}

function placeOrder() {
    const cart = getCart();
    
    if (cart.items.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const orderData = {
        orderId: generateOrderId(),
        customerName: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipcode: document.getElementById('zipcode').value,
        items: cart.items,
        subtotal: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0),
        shipping: 1500,  // Rs 1,500
        total: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) + 1500,
        paymentMethod: document.getElementById('payment-method').value,
        status: 'pending',
        orderDate: new Date().toISOString(),
        estimatedDelivery: getEstimatedDelivery()
    };
    
    // Save to backend
    saveOrder(orderData);
    
    // Clear cart and redirect
    clearCart();
    alert('Order placed successfully! Order ID: ' + orderData.orderId);
    window.location.href = 'orders.html';
}

function generateOrderId() {
    return 'ORD-' + Date.now();
}

function getEstimatedDelivery() {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 days from now
    return date.toISOString();
}

function saveOrder(orderData) {
    const user = getCurrentUser();
    if (user) {
        orderData.userEmail = user.email; // Associate order with user
    }
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Also send to backend
    apiCall('/orders', 'POST', orderData);
}
