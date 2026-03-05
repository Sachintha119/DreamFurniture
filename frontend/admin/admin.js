// Admin Panel JavaScript

// Check Authentication
function checkAuth() {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn || adminLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    const nameElement = document.getElementById('admin-name');
    if (nameElement && adminUser) {
        nameElement.textContent = adminUser.username;
    }
    
    // Listen for storage changes (when data updates in other tabs)
    window.addEventListener('storage', function(e) {
        if (e.key === 'users' || e.key === 'orders' || e.key === 'products') {
            console.log('📡 Data updated from another tab:', e.key);
            // Reload current page if users/orders changed
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'users.html' || currentPage === 'orders.html' || currentPage === 'products.html' || currentPage === 'dashboard.html') {
                location.reload();
            }
        }
    });
    
    return true;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }
}

// Load Dashboard
function loadDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
        const amount = order.pricing ? order.pricing.total : order.total;
        return sum + (amount || 0);
    }, 0);
    const totalUsers = users.length;
    
    // Update stats
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-revenue').textContent = 'Rs ' + totalRevenue.toLocaleString();
    document.getElementById('total-users').textContent = totalUsers;
    
    // Load recent orders
    const recentOrders = orders.slice(-5).reverse();
    const tbody = document.getElementById('recent-orders');
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders yet</td></tr>';
    } else {
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>Rs ${(order.pricing ? order.pricing.total : order.total).toLocaleString()}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
}

// Load Products
function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Initialize with default products if empty
    if (products.length === 0) {
        products = [
            {id: 1, name: 'Modern Dining Table', category: 'table', price: 45000, stock: 15, image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=100&h=100&fit=crop'},
            {id: 2, name: 'Executive Desk', category: 'table', price: 68000, stock: 10, image: 'https://images.unsplash.com/photo-1593642632400-2682810df593?w=100&h=100&fit=crop'},
            {id: 3, name: 'Coffee Table', category: 'table', price: 22000, stock: 20, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'},
            {id: 4, name: 'Conference Table', category: 'table', price: 90000, stock: 8, image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100&h=100&fit=crop'},
            {id: 5, name: 'Side Table', category: 'table', price: 13500, stock: 25, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop'},
            {id: 6, name: 'Leather Office Chair', category: 'chair', price: 30000, stock: 12, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop'},
            {id: 7, name: 'Dining Chair Set', category: 'chair', price: 19500, stock: 18, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'},
            {id: 8, name: 'Lounge Chair', category: 'chair', price: 37500, stock: 14, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop'},
            {id: 9, name: 'Gaming Chair', category: 'chair', price: 27000, stock: 22, image: 'https://images.unsplash.com/photo-1598882017221-7a3d3f48e4ca?w=100&h=100&fit=crop'},
            {id: 10, name: 'Executive Manager Chair', category: 'chair', price: 52500, stock: 9, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&h=100&fit=crop'}
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Update total products count
    const totalProductsEl = document.getElementById('total-products');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length;
    }
    
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = products.map(product => {
        const isSoldOut = product.stock <= 0;
        return `
        <tr ${isSoldOut ? 'class="table-danger"' : ''}>
            <td>${product.id}</td>
            <td><img src="${product.image}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"></td>
            <td>${product.name} ${isSoldOut ? '<span class="badge bg-danger ms-2">SOLD OUT</span>' : ''}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>Rs ${product.price.toLocaleString()}</td>
            <td>${product.stock} ${isSoldOut ? '<span class="text-danger fw-bold">(Out of Stock)</span>' : ''}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick='editProduct(${JSON.stringify(product).replace(/'/g, "&apos;")})'>Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `;
    }).join('');
}

// Add Product
function addProduct() {
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseInt(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    
    const imageType = document.querySelector('input[name="image-type"]:checked').value;
    let image = '';
    
    if (imageType === 'url') {
        image = document.getElementById('product-image').value;
    } else {
        const fileInput = document.getElementById('product-image-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                image = e.target.result;
                saveProduct(name, category, price, stock, description, image);
            };
            reader.readAsDataURL(file);
            return;
        }
    }
    
    saveProduct(name, category, price, stock, description, image);
}

function saveProduct(name, category, price, stock, description, image) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
        id: newId,
        name: name,
        category: category,
        price: price,
        stock: stock,
        description: description,
        image: image || 'https://via.placeholder.com/100'
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    alert('Product added successfully!');
    location.reload();
}

// Edit Product
function editProduct(product) {
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-stock').value = product.stock;
    document.getElementById('edit-product-description').value = product.description || '';
    document.getElementById('edit-product-image-url').value = product.image;
    
    // Show current image
    const currentImageDiv = document.getElementById('edit-current-image');
    currentImageDiv.innerHTML = `<img src="${product.image}" class="img-thumbnail" style="max-width: 200px;"><p class="text-muted small mt-1">Current Image</p>`;
    
    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

function saveProductEdit() {
    const id = parseInt(document.getElementById('edit-product-id').value);
    const name = document.getElementById('edit-product-name').value;
    const category = document.getElementById('edit-product-category').value;
    const price = parseInt(document.getElementById('edit-product-price').value);
    const stock = parseInt(document.getElementById('edit-product-stock').value);
    const description = document.getElementById('edit-product-description').value;
    
    const imageType = document.querySelector('input[name="edit-image-type"]:checked').value;
    
    if (imageType === 'upload') {
        const fileInput = document.getElementById('edit-product-image-file');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                updateProduct(id, name, category, price, stock, description, e.target.result);
            };
            reader.readAsDataURL(file);
            return;
        }
    }
    
    const image = document.getElementById('edit-product-image-url').value;
    updateProduct(id, name, category, price, stock, description, image);
}

function updateProduct(id, name, category, price, stock, description, image) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products[index] = {
            ...products[index],
            name: name,
            category: category,
            price: price,
            stock: stock,
            description: description,
            image: image
        };
        
        localStorage.setItem('products', JSON.stringify(products));
        alert('Product updated successfully!');
        location.reload();
    }
}

// Delete Product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const filteredProducts = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(filteredProducts));
        alert('Product deleted successfully!');
        loadProducts();
    }
}

// Load Admin Orders
function loadAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center">No orders yet</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => {
        const isCustom = order.orderType === 'custom-table';
        return `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between">
                    <div>
                        <strong>Order ID:</strong> ${order.orderId}
                        ${isCustom ? '<span class="badge bg-warning text-dark ms-2">Custom Table</span>' : ''}
                    </div>
                    <div>
                        <select class="form-select form-select-sm" style="width: auto;" onchange="updateOrderStatus('${order.orderId}', this.value)">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Customer:</strong> ${order.customerName}</p>
                            <p><strong>Email:</strong> ${order.email || order.userEmail}</p>
                            <p><strong>Phone:</strong> ${order.phone || order.customerContact}</p>
                            <p><strong>Address:</strong> ${order.address || order.customerAddress}</p>
                        </div>
                        <div class="col-md-6 text-end">
                            <p><strong>Total:</strong> Rs ${(order.pricing ? order.pricing.total : order.total).toLocaleString()}</p>
                            <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                            <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status.toUpperCase()}</span></p>
                        </div>
                    </div>
                    ${isCustom ? generateCustomTableInfo(order) : generateRegularOrderInfo(order)}
                </div>
            </div>
        `;
    }).join('');
}

// Generate Custom Table Info
function generateCustomTableInfo(order) {
    return `
        <div class="mt-3 p-3 bg-light rounded">
            <h6>Custom Table Configuration:</h6>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Size:</strong> ${order.configuration.size}</p>
                    <p><strong>Top Color:</strong> ${order.configuration.topColor}</p>
                    <p><strong>Leg Color:</strong> ${order.configuration.legColor}</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Wire Holes:</strong> ${order.configuration.wireHoles}</p>
                    <p><strong>Front Cover:</strong> ${order.configuration.frontCover === 'no' ? 'None' : order.configuration.frontCover + ' inch'}</p>
                    <p><strong>Delivery:</strong> ${order.configuration.deliveryType}</p>
                </div>
            </div>
            ${order.configuration.description ? '<p><strong>Notes:</strong> ' + order.configuration.description + '</p>' : ''}
            <p><small class="text-muted">Base: Rs ${order.pricing.basePrice.toLocaleString()} | Cover: Rs ${order.pricing.coverPrice.toLocaleString()} | Delivery: Rs ${order.pricing.deliveryPrice.toLocaleString()}</small></p>
        </div>
    `;
}

// Generate Regular Order Info
function generateRegularOrderInfo(order) {
    if (!order.items) return '';
    return `
        <div class="mt-3">
            <h6>Items:</h6>
            <ul>
                ${order.items.map(item => `<li>${item.name} x${item.quantity} - Rs ${(item.price * item.quantity).toLocaleString()}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        alert('Order status updated to: ' + newStatus);
        loadAdminOrders();
    }
}

// Load Users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Debug log
    console.log('🔍 Admin Panel - Users Data:', {
        totalUsers: users.length,
        usersList: users.map(u => ({ name: u.name, email: u.email, date: u.registeredDate }))
    });
    
    // Update user count
    document.getElementById('user-count').textContent = users.length;
    
    const tbody = document.getElementById('users-table');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-warning"><strong>No users found. Make sure you registered in the USER panel first!</strong></td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        // Count user orders
        const userOrders = orders.filter(o => o.email === user.email || o.userEmail === user.email);
        const totalSpent = userOrders.reduce((sum, order) => sum + (order.pricing ? order.pricing.total : order.total || 0), 0);
        
        return `
        <tr>
            <td>
                <img src="${user.photo || 'https://via.placeholder.com/40'}" width="40" height="40" style="border-radius: 50%; object-fit: cover;">
            </td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.address ? user.address.substring(0, 30) + '...' : 'N/A'}</td>
            <td>${new Date(user.registeredDate || Date.now()).toLocaleDateString()}</td>
            <td><span class="badge bg-info">${userOrders.length}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick='viewUserDetails(${JSON.stringify(user).replace(/'/g, "&apos;")})'>View</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.email}')">Delete</button>
            </td>
        </tr>
    `;
    }).join('');
}

// View User Details
function viewUserDetails(user) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(o => o.email === user.email || o.userEmail === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.pricing ? order.pricing.total : order.total || 0), 0);
    
    // Set modal content
    document.getElementById('user-photo').src = user.photo || 'https://via.placeholder.com/150';
    document.getElementById('user-modal-name').textContent = user.name;
    document.getElementById('user-modal-email').textContent = user.email;
    document.getElementById('user-modal-fullname').textContent = user.name;
    document.getElementById('user-modal-email-detail').textContent = user.email;
    document.getElementById('user-modal-phone').textContent = user.phone || 'N/A';
    document.getElementById('user-modal-address').textContent = user.address || 'N/A';
    document.getElementById('user-modal-date').textContent = new Date(user.registeredDate || Date.now()).toLocaleString();
    document.getElementById('user-modal-orders').textContent = userOrders.length + ' orders';
    document.getElementById('user-modal-spent').textContent = 'Rs ' + totalSpent.toLocaleString();
    
    // Show recent orders
    const ordersList = document.getElementById('user-orders-list');
    if (userOrders.length === 0) {
        ordersList.innerHTML = '<p class="text-muted">No orders yet</p>';
    } else {
        ordersList.innerHTML = userOrders.slice(-3).reverse().map(order => `
            <div class="card mb-2">
                <div class="card-body p-2">
                    <div class="d-flex justify-content-between">
                        <div>
                            <strong>Order #${order.orderId}</strong>
                            <p class="text-muted small mb-0">${new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-${getStatusColor(order.status)}">${order.status.toUpperCase()}</span>
                            <p class="text-muted small mb-0">Rs ${(order.pricing ? order.pricing.total : order.total).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Set delete button
    document.getElementById('deleteUserBtn').onclick = function() {
        if (document.getElementById('userDetailsModal').classList.contains('show')) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
            modal.hide();
        }
        deleteUser(user.email);
    };
    
    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modal.show();
}

// Delete User
function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filteredUsers = users.filter(u => u.email !== email);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        alert('User deleted!');
        loadUsers();
    }
}

// Load Reports
function loadReports() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing ? order.pricing.total : order.total || 0), 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const customOrders = orders.filter(o => o.orderType === 'custom-table').length;
    
    // Status breakdown
    const statusCount = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    
    // Update UI
    document.getElementById('report-total-orders').textContent = totalOrders;
    document.getElementById('report-total-revenue').textContent = 'Rs ' + totalRevenue.toLocaleString();
    document.getElementById('report-avg-order').textContent = 'Rs ' + Math.round(avgOrder).toLocaleString();
    document.getElementById('report-custom-orders').textContent = customOrders;
    
    document.getElementById('status-pending').textContent = statusCount.pending;
    document.getElementById('status-processing').textContent = statusCount.processing;
    document.getElementById('status-shipped').textContent = statusCount.shipped;
    document.getElementById('status-delivered').textContent = statusCount.delivered;
    document.getElementById('status-cancelled').textContent = statusCount.cancelled;
}

// Export Report
function exportReport() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let csv = 'Order ID,Customer,Email,Total,Status,Date\n';
    
    orders.forEach(order => {
        csv += `${order.orderId},${order.customerName},${order.email || order.userEmail},${order.pricing ? order.pricing.total : order.total},${order.status},${order.orderDate}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders_report.csv';
    a.click();
}

// Save Shipping Settings
function saveShippingSettings() {
    alert('Shipping settings saved! (This would update the database)');
}

// Save Table Pricing
function saveTablePricing() {
    alert('Table pricing saved! (This would update the database)');
}

// Change Password
function changePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        alert('Password changed successfully! (This would update in database)');
    }
}

// Helper Functions
function getStatusColor(status) {
    const colors = {
        pending: 'warning',
        processing: 'info',
        shipped: 'primary',
        delivered: 'success',
        cancelled: 'danger'
    };
    return colors[status] || 'secondary';
}
