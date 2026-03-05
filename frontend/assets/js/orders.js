// Orders Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

function loadOrders() {
    const user = getCurrentUser();
    
    // Redirect to login if not logged in
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Get all orders and filter by current user's email
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const orders = allOrders.filter(order => order.userEmail === user.email);
    
    const ordersContainer = document.getElementById('orders-container');
    const noOrders = document.getElementById('no-orders');
    
    if (orders.length === 0) {
        ordersContainer.style.display = 'none';
        noOrders.style.display = 'block';
    } else {
        ordersContainer.style.display = 'block';
        noOrders.style.display = 'none';
        ordersContainer.innerHTML = '';
        
        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'card mb-4';
            
            // Detect custom table order
            const isCustomOrder = order.orderType === 'custom-table';
            
            orderCard.innerHTML = `
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="mb-0">Order ID: ${order.orderId} ${isCustomOrder ? '<span class="badge bg-warning text-dark">Custom Table</span>' : ''}</h5>
                            <small class="text-muted">${formatDate(order.orderDate)}</small>
                        </div>
                        <div class="col-md-6 text-end">
                            <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Customer:</strong> ${order.customerName}</p>
                            <p><strong>Email:</strong> ${order.email || order.userEmail || 'N/A'}</p>
                            <p><strong>Phone:</strong> ${order.phone || order.customerContact || 'N/A'}</p>
                        </div>
                        <div class="col-md-6 text-end">
                            <p><strong>Total:</strong> ${isCustomOrder && order.pricing ? 'Rs ' + order.pricing.total.toLocaleString() : formatCurrency(order.total)}</p>
                            ${order.estimatedDelivery ? '<p><strong>Estimated Delivery:</strong> ' + formatDate(order.estimatedDelivery) + '</p>' : ''}
                        </div>
                    </div>
                    
                    ${isCustomOrder ? `
                        <div class="mt-3 p-3 bg-light rounded">
                            <h6 class="fw-bold">Custom Table Configuration:</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="list-unstyled mb-0">
                                        <li>📏 <strong>Size:</strong> ${order.configuration.size}</li>
                                        <li>🎨 <strong>Top Color:</strong> ${order.configuration.topColor}</li>
                                        <li>🦿 <strong>Leg Color:</strong> ${order.configuration.legColor}</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <ul class="list-unstyled mb-0">
                                        <li>🔌 <strong>Wire Holes:</strong> ${order.configuration.wireHoles === 'yes' ? 'Yes' : 'No'}</li>
                                        <li>📦 <strong>Front Cover:</strong> ${order.configuration.frontCover === 'no' ? 'None' : order.configuration.frontCover + ' inch'}</li>
                                        <li>🚚 <strong>Delivery:</strong> ${order.configuration.deliveryType === 'colombo' ? 'Colombo District' : order.configuration.deliveryType === 'other-district' ? 'Other Districts' : 'Factory Pickup'}</li>
                                    </ul>
                                </div>
                            </div>
                            ${order.configuration.description ? '<div class="mt-2"><strong>Notes:</strong> ' + order.configuration.description + '</div>' : ''}
                            ${order.pricing ? '<div class="mt-2"><small class="text-muted">Base: Rs ' + order.pricing.basePrice.toLocaleString() + ' | Cover: Rs ' + order.pricing.coverPrice.toLocaleString() + ' | Delivery: Rs ' + order.pricing.deliveryPrice.toLocaleString() + '</small></div>' : ''}
                        </div>
                    ` : `
                        <div class="mt-3">
                            <h6>Items:</h6>
                            <ul class="list-unstyled">
                                ${order.items ? order.items.map(item => `
                                    <li>${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}</li>
                                `).join('') : ''}
                            </ul>
                        </div>
                    `}
                        </ul>
                    </div>
                </div>
                <div class="card-footer bg-light">
                    <button class="btn btn-sm btn-info" onclick="showOrderDetail('${order.orderId}')">View Details</button>
                    ${order.status === 'pending' ? `<button class="btn btn-sm btn-danger" onclick="cancelOrder('${order.orderId}')">Cancel Order</button>` : ''}
                </div>
            `;
            ordersContainer.appendChild(orderCard);
        });
    }
}

function showOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) return;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    const content = document.getElementById('orderDetailContent');
    
    content.innerHTML = `
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Status:</strong> <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span></p>
        <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
        <p><strong>Estimated Delivery:</strong> ${formatDate(order.estimatedDelivery)}</p>
        <hr>
        <h6>Shipping Address:</h6>
        <p>
            ${order.customerName}<br>
            ${order.address}<br>
            ${order.city}, ${order.zipcode}<br>
            ${order.phone}
        </p>
        <hr>
        <h6>Items:</h6>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <hr>
        <div class="text-end">
            <p><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p>
            <p><strong>Shipping:</strong> ${formatCurrency(order.shipping)}</p>
            <p class="fs-5"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>
    `;
    
    const cancelBtn = document.getElementById('cancel-order-btn');
    if (order.status === 'pending') {
        cancelBtn.style.display = 'block';
        cancelBtn.onclick = () => {
            modal.hide();
            cancelOrder(orderId);
        };
    } else {
        cancelBtn.style.display = 'none';
    }
    
    modal.show();
}

function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderId === orderId);
    
    if (order) {
        order.status = 'cancelled';
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Also send to backend
        apiCall('/orders/' + orderId + '/cancel', 'PUT', { status: 'cancelled' });
        
        loadOrders();
        showNotification('Order cancelled successfully!', 'success');
    }
}

// Track Order (for tracking system)
function trackOrder(orderId) {
    // This can be extended with real tracking API
    alert('Tracking information for ' + orderId + ':\nStatus: Shipped\nExpected Delivery: 5-7 days');
}
