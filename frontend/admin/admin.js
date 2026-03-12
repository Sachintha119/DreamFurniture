// Admin Panel JavaScript

let adminUsersCache = [];
let adminOrdersCache = [];

function getAdminCredentials() {
    let creds = null;
    try {
        creds = JSON.parse(localStorage.getItem('adminCredentials'));
    } catch (e) {
        creds = null;
    }

    if (!creds || !creds.username || !creds.password) {
        creds = {
            username: 'admin',
            password: 'admin123'
        };
        localStorage.setItem('adminCredentials', JSON.stringify(creds));
    }

    return creds;
}

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

function getOrderAmount(order) {
    const amount = order && order.pricing ? order.pricing.total : order ? order.total : 0;
    return Number(amount || 0);
}

function isRevenueOrder(order) {
    return (order.status || '').toLowerCase() !== 'cancelled';
}

// Load Dashboard
function loadDashboard() {
    Promise.all([
        fetch('http://localhost:8080/api/orders').then(r => r.json()).catch(() => JSON.parse(localStorage.getItem('orders')) || []),
        fetch('http://localhost:8080/api/users').then(r => r.json()).catch(() => JSON.parse(localStorage.getItem('users')) || [])
    ]).then(([ordersData, usersData]) => {
        const orders = Array.isArray(ordersData) ? ordersData : [];
        const users = Array.isArray(usersData) ? usersData : [];

        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('users', JSON.stringify(users));

        const totalOrders = orders.length;
        const totalRevenue = orders.filter(isRevenueOrder).reduce((sum, order) => sum + getOrderAmount(order), 0);
        const totalUsers = users.length;

        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('total-revenue').textContent = 'Rs ' + totalRevenue.toLocaleString();
        document.getElementById('total-users').textContent = totalUsers;

        const recentOrders = orders.slice(-5).reverse();
        const tbody = document.getElementById('recent-orders');

        if (recentOrders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders yet</td></tr>';
        } else {
            tbody.innerHTML = recentOrders.map(order => `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${order.customerName}</td>
                    <td>Rs ${getOrderAmount(order).toLocaleString()}</td>
                    <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                    <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
    });
}

// Load Products
function loadProducts() {
    fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(products => {
            localStorage.setItem('products', JSON.stringify(products || []));
            renderProductsTable(products || []);
        })
        .catch(() => {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            renderProductsTable(products);
        });
}

function renderProductsTable(products) {
    const totalProductsEl = document.getElementById('total-products');
    if (totalProductsEl) {
        totalProductsEl.textContent = products.length;
    }

    const tbody = document.getElementById('products-table');
    if (!tbody) return;

    tbody.innerHTML = products.map(product => {
        const isSoldOut = product.stock <= 0;
        return `
        <tr ${isSoldOut ? 'class="table-danger"' : ''}>
            <td>${product.id}</td>
            <td><img src="${product.image}" width="50" height="50" style="object-fit: cover; border-radius: 5px;"></td>
            <td>${product.name} ${isSoldOut ? '<span class="badge bg-danger ms-2">SOLD OUT</span>' : ''}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>Rs ${Number(product.price).toLocaleString()}</td>
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
    const newProduct = {
        name: name,
        category: category,
        price: price,
        stock: stock,
        description: description,
        image: image || 'https://via.placeholder.com/100'
    };

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to add product: ' + data.error);
                return;
            }
            alert('Product added successfully!');
            loadProducts();
        })
        .catch(() => {
            alert('Backend unavailable. Product not added.');
        });
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
    const payload = {
        name: name,
        category: category,
        price: price,
        stock: stock,
        description: description,
        image: image
    };

    fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to update product: ' + data.error);
                return;
            }
            alert('Product updated successfully!');
            loadProducts();
            const modalEl = document.getElementById('editProductModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        })
        .catch(() => {
            alert('Backend unavailable. Product update failed.');
        });
}

// Delete Product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to delete product: ' + data.error);
                    return;
                }
                alert('Product deleted successfully!');
                loadProducts();
            })
            .catch(() => {
                alert('Backend unavailable. Product delete failed.');
            });
    }
}

// Load Admin Orders
function loadAdminOrders() {
    fetch('http://localhost:8080/api/orders')
        .then(response => response.json())
        .then(orders => {
            adminOrdersCache = Array.isArray(orders) ? orders : [];
            applyAdminOrderFilters();
        })
        .catch(() => {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            adminOrdersCache = orders;
            applyAdminOrderFilters();
        });
}

function initAdminOrderFilters() {
    const searchInput = document.getElementById('admin-order-search');
    const statusSelect = document.getElementById('admin-order-status-filter');

    if (searchInput) {
        searchInput.addEventListener('input', applyAdminOrderFilters);
    }
    if (statusSelect) {
        statusSelect.addEventListener('change', applyAdminOrderFilters);
    }
}

function applyAdminOrderFilters() {
    const searchInput = document.getElementById('admin-order-search');
    const statusSelect = document.getElementById('admin-order-status-filter');
    const search = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const status = (statusSelect ? statusSelect.value : 'all').toLowerCase();

    const filtered = adminOrdersCache.filter(order => {
        const orderStatus = (order.status || '').toLowerCase();
        const matchesStatus = status === 'all' || orderStatus === status;

        const haystack = [
            order.orderId,
            order.customerName,
            order.email,
            order.userEmail
        ].join(' ').toLowerCase();
        const matchesSearch = !search || haystack.includes(search);

        return matchesStatus && matchesSearch;
    });

    const countEl = document.getElementById('admin-order-count');
    if (countEl) {
        countEl.textContent = filtered.length;
    }

    renderAdminOrders(filtered);
}

function clearAdminOrderFilters() {
    const searchInput = document.getElementById('admin-order-search');
    const statusSelect = document.getElementById('admin-order-status-filter');
    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = 'all';
    applyAdminOrderFilters();
}

function renderAdminOrders(orders) {
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
                <div class="card-footer bg-light d-flex justify-content-end gap-2">
                    ${order.status === 'cancelled' ? `<button class="btn btn-sm btn-outline-danger" onclick="removeOrder('${order.orderId}')">Remove Order</button>` : ''}
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
    fetch(`http://localhost:8080/api/orders/${orderId}${newStatus === 'cancelled' ? '/cancel' : ''}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to update order: ' + data.error);
                return;
            }

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderIndex = orders.findIndex(o => o.orderId === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                localStorage.setItem('orders', JSON.stringify(orders));
            }

            const cachedOrder = adminOrdersCache.find(order => order.orderId === orderId);
            if (cachedOrder) {
                cachedOrder.status = newStatus;
            }

            alert('Order status updated to: ' + newStatus);
            loadAdminOrders();
        })
        .catch(() => {
            alert('Backend unavailable. Order update failed.');
        });
}

function removeOrder(orderId) {
    if (!confirm('Remove this order permanently?')) {
        return;
    }

    fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Failed to remove order: ' + data.error);
                return;
            }

            // Sync local cache
            adminOrdersCache = adminOrdersCache.filter(order => order.orderId !== orderId);

            // Sync localStorage cache used by some pages
            const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
            localStorage.setItem('orders', JSON.stringify(localOrders.filter(order => order.orderId !== orderId)));

            applyAdminOrderFilters();
            alert('Order removed successfully!');
        })
        .catch(() => {
            alert('Backend unavailable. Order remove failed.');
        });
}

function removeAllCancelledOrders() {
    const cancelledOrders = adminOrdersCache.filter(order => (order.status || '').toLowerCase() === 'cancelled');

    if (cancelledOrders.length === 0) {
        alert('No cancelled orders to remove.');
        return;
    }

    if (!confirm(`Remove all ${cancelledOrders.length} cancelled orders permanently?`)) {
        return;
    }

    const removeRequests = cancelledOrders.map(order =>
        fetch(`http://localhost:8080/api/orders/${order.orderId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .catch(() => ({ error: 'Backend unavailable' }))
    );

    Promise.all(removeRequests).then(results => {
        const failed = results.filter(result => result && result.error).length;
        const removedCount = cancelledOrders.length - failed;

        if (removedCount > 0) {
            const cancelledIds = new Set(cancelledOrders.map(order => order.orderId));

            adminOrdersCache = adminOrdersCache.filter(order => !cancelledIds.has(order.orderId));

            const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
            localStorage.setItem(
                'orders',
                JSON.stringify(localOrders.filter(order => !cancelledIds.has(order.orderId)))
            );

            applyAdminOrderFilters();
        }

        if (failed > 0) {
            alert(`Removed ${removedCount} cancelled order(s). ${failed} failed.`);
            loadAdminOrders();
            return;
        }

        alert(`Removed ${removedCount} cancelled order(s) successfully!`);
    });
}

// Load Users
function loadUsers() {
    // Fetch users from backend API
    fetch('http://localhost:8080/api/users')
        .then(response => response.json())
        .then(users => {
            adminUsersCache = Array.isArray(users) ? users : [];
            displayUsersTable(users);
        })
        .catch(error => {
            console.log('Backend unavailable, using localStorage');
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            adminUsersCache = users;
            displayUsersTable(users);
        });
}

function displayUsersTable(users) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Debug log
    console.log('🔍 Admin Panel - Users Data:', {
        totalUsers: users.length,
        usersList: users.map(u => ({ name: u.name, email: u.email }))
    });
    
    // Update user count
    const userCountEl = document.getElementById('user-count');
    if (userCountEl) {
        userCountEl.textContent = users.length;
    }
    
    const tbody = document.getElementById('users-table');
    if (!tbody) return;
    
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
        const removeFromPageAndLocal = () => {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(u => u.email !== email);
            localStorage.setItem('users', JSON.stringify(filteredUsers));

            adminUsersCache = adminUsersCache.filter(u => u.email !== email);
            displayUsersTable(adminUsersCache);

            const userModalEl = document.getElementById('userDetailsModal');
            const userModal = bootstrap.Modal.getInstance(userModalEl);
            if (userModal) {
                userModal.hide();
            }
        };

        const user = adminUsersCache.find(u => u.email === email);

        if (!user || !user.id) {
            removeFromPageAndLocal();
            alert('User deleted locally. Backend user was not found.');
            loadUsers();
            return;
        }

        fetch(`http://localhost:8080/api/users/${user.id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert('Failed to delete user: ' + data.error);
                    return;
                }

                removeFromPageAndLocal();
                alert('User deleted!');
                loadUsers();
            })
            .catch(() => {
                alert('Backend unavailable. User delete failed.');
            });
    }
}

// Load Reports
function loadReports() {
    fetch('http://localhost:8080/api/orders')
        .then(response => response.json())
        .catch(() => JSON.parse(localStorage.getItem('orders')) || [])
        .then(ordersData => {
            const orders = Array.isArray(ordersData) ? ordersData : [];
            localStorage.setItem('orders', JSON.stringify(orders));

            const totalOrders = orders.length;
            const revenueOrders = orders.filter(isRevenueOrder);
            const totalRevenue = revenueOrders.reduce((sum, order) => sum + getOrderAmount(order), 0);
            const avgOrder = revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;
            const customOrders = orders.filter(o => o.orderType === 'custom-table').length;

            const statusCount = {
                pending: orders.filter(o => o.status === 'pending').length,
                processing: orders.filter(o => o.status === 'processing').length,
                shipped: orders.filter(o => o.status === 'shipped').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length
            };

            document.getElementById('report-total-orders').textContent = totalOrders;
            document.getElementById('report-total-revenue').textContent = 'Rs ' + totalRevenue.toLocaleString();
            document.getElementById('report-avg-order').textContent = 'Rs ' + Math.round(avgOrder).toLocaleString();
            document.getElementById('report-custom-orders').textContent = customOrders;

            document.getElementById('status-pending').textContent = statusCount.pending;
            document.getElementById('status-processing').textContent = statusCount.processing;
            document.getElementById('status-shipped').textContent = statusCount.shipped;
            document.getElementById('status-delivered').textContent = statusCount.delivered;
            document.getElementById('status-cancelled').textContent = statusCount.cancelled;
        });
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
    const creds = getAdminCredentials();
    const currentPassword = prompt('Enter current password:');

    if (currentPassword === null) {
        return;
    }

    if (currentPassword !== creds.password) {
        alert('Current password is incorrect.');
        return;
    }

    const newPassword = prompt('Enter new password (min 6 characters):');
    if (newPassword === null) {
        return;
    }

    if (newPassword.trim().length < 6) {
        alert('New password must be at least 6 characters.');
        return;
    }

    const confirmPassword = prompt('Confirm new password:');
    if (confirmPassword === null) {
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const updatedCreds = {
        username: creds.username,
        password: newPassword
    };

    localStorage.setItem('adminCredentials', JSON.stringify(updatedCreds));
    alert('Admin password changed successfully!');
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
