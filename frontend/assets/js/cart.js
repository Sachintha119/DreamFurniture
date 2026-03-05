// Shopping Cart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

function loadCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    
    if (cart.items.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartDiv.style.display = 'block';
    } else {
        cartItemsContainer.style.display = 'block';
        emptyCartDiv.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        
        cart.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'card mb-3 cart-item';
            cartItem.innerHTML = `
                <div class="row no-gutters">
                    <div class="col-md-2 d-flex align-items-center justify-content-center" style="background-color: #f8f9fa; padding: 10px;">
                        <img src="${item.image}" class="img-fluid" style="height: 100px; width: 100px; object-fit: cover; object-position: center;">
                    </div>
                    <div class="col-md-10">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h5 class="card-title">${item.name}</h5>
                                </div>
                                <div class="col-md-6 text-end">
                                    <h6>${formatCurrency(item.price)}</h6>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-4">
                                    <label class="form-label">Quantity:</label>
                                    <div class="qty-control">
                                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                                        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)" class="form-control form-control-sm">
                                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <p class="text-muted">Total: ${formatCurrency(item.price * item.quantity)}</p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
}

function updateQuantity(productId, quantity) {
    updateCartItemQuantity(productId, quantity);
    loadCart();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 1500 : 0;  // Rs 1,500 shipping
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('total').textContent = formatCurrency(total);
}
